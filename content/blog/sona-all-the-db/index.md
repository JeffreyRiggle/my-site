---
title: 'Lessons from the SONA Backend'
date: '2025-03-02'
---

## The engine behind SONA

Building on the last blog, I want to focus on the specific decisions on the backend for the SONA project. Looking back on this project, I see growth in some areas, but I also see new areas of weakness emerge. Now there are enough weaknesses in this that I cannot cover them all. Since I approached this like a code review, things like commenting style made it to my notes. To avoid making this a painful, drawn-out code review, I will focus on the most egregious issues.

## Starting off on a good note

While I didn't realize it at the time, I showed some maturity in my process. Because my goal had a target beyond learning or a sense of misplaced pride in building everything myself, I used third-party libraries. Had I followed the path of my last project, I might have been tempted to build my own abstraction to create a RESTful API; instead, I used [gorilla/mux](https://github.com/gorilla/mux). This saved me hours, if not days, of dealing with the HTTP library directly. It also allowed me to focus on the core problem. In addition to this library, I used many others, like database drivers and AWS clients.

Another very positive aspect was avoiding the creation of a premature abstraction in an attempt to solve all problems. In the past, I might have been tempted to create a webhook library that aimed to solve everyone's problems with webhooks. This would have inevitably failed. The net result would have been an abstraction that failed to meet even my needs for webhooks.

## Database hell

In this project, I noticed a pattern. There was a deliberate effort to allow the end user to pick their desired technology. Now I see this as a failed attempt to remove vendor lock-in.

I supported three major databases: Datastore, MySQL, and DynamoDB. This is a terrible straddle between relational and non-relational databases. If the stated goal was to avoid vendor lock-in, the usual culprit is the cloud vendor, not the database vendor. Making the system work well on a single database, such as MySQL, Postgres, or MongoDB, would have accomplished the same goal without the consequences.

### The pitfall of abstraction

There is no shortage of documentation and blogs talking about the differences between relational and non-relational databases. However, my experience in this project taught me something a bit different. While you can make either model work behind a single interface, one or both implementations will be inefficient. I don't think I respected that enough going into this. Abstraction is a powerful tool, but it can also make you blind to inefficiencies inherent in it. These may be acceptable, but there is no such thing as a free abstraction. In my abstraction, I wanted to support any type of query on any column. The net result was implementation misses in both implementations.

### Failures of Non-Relational Representation

To limit scope, I will focus only on the failings of my DynamoDB implementation. If you know anything about DynamoDB, you will know that you can either query or scan the database. Queries are the optimal route for retrieving data from the database because they use the database’s partitions effectively. However, you can do a suboptimal scan to perform other queries you may need. Notice the key focus is on performance. To use DynamoDB effectively, you should query, not scan. However, to query, you need to filter on an index, and indexes have to be predefined. This means a well-designed DynamoDB deployment requires planned query patterns. This abstraction allowed the creation of dynamic queries on any attribute that might not have an index. The net result was having to scan for all my incident search requests. At scale, this would have shown as a performance problem.

### But you did better on MySQL, right?

The relational implementation fared better, but the abstraction still leaked in some interesting ways. Additionally, I do see some implementation misses. To support dynamic queries, I created the following data structure.

```go
type Filter struct {
	Property       string `json:"property"`
	ComparisonType string `json:"comparison"`
	Value          string `json:"value"`
}

type ComplexFilter struct {
	Children []*ComplexFilter `json:"children"`
	Filter   []Filter         `json:"filters"`
	Junction string           `json:"junction"`
}

type FilterRequest struct {
	Filters  []ComplexFilter `json:"complexfilters"`
	Junction string          `json:"union"`
}
```

As you can see, this should allow you to chain together filter conditions with a junction (AND/OR). This has two issues. The first is similar to the NoSQL problem. While relational databases can do these queries, they tend to do better when you generate indexes. In this case, there is no good index to create. The secondary issue is somewhat painful for me to look at. It appears that the implementation missed a requirement. Do you see the issue with this code?

```go
for i, filter := range filter.Filters {
		if i != 0 {
			buffer.WriteString("AND ")
		}
		for iter, complexFilter := range filter.Filter {
			if iter != 0 {
				buffer.WriteString("AND ")
			}
			buffer.WriteString(complexFilter.Property + convertToSQLComparisonType(complexFilter))
			args = append(args, complexFilter.Value)
		}
	}
```

One last commentary on this solution. As defined in the prior blog post, any incident can have any number of attributes. Here is how I built the data model.

```sql
CREATE TABLE Incidents (
    Id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Type VARCHAR(255),
	Description VARCHAR(1048),
	Reporter VARCHAR(255),
	State VARCHAR(255)
)

CREATE TABLE IncidentAttributes (
    IncidentId INT UNSIGNED NOT NULL,
	AttributeName VARCHAR(255),
	AttributeValue VARCHAR(255),
	PRIMARY KEY(IncidentId, AttributeName),
	FOREIGN KEY (IncidentId) REFERENCES Incidents(Id)
)
```

Conventional wisdom says this is the correct solution, and it likely was. However, it may have been interesting to benchmark the difference between this model and a more non-standard model.

```sql
CREATE TABLE Incidents (
    Id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Type VARCHAR(255),
	Description VARCHAR(1048),
	Reporter VARCHAR(255),
	State VARCHAR(255),
    Attributes JSON
)
```

Because every attribute query required joining these tables, the flexibility came at a cost. A JSON column may have simplified reads at the expense of more complicated inserts and updates.

## Identity as an afterthought

A feature I bolted on later was authentication and authorization. This project highlights the dangers of rolling your own authentication and authorization. Now, before I completely rip apart the solution, I would like to point out one thing I handled passably. I did not store user passwords as plaintext in the database. Instead, I peppered the password with the user’s email and ran that through a SHA256 hash before storing it in the database, which is better than nothing.

### Tokens matter.

The way I permissioned the application was the following. Once a user completed a login, they would be handed a token. No, not a sensible JWT. This was a special token of my own creation. This token contained some key data and was base64 encoded. The encoded value was then sent back to the client. The client would then have to provide this token in subsequent API requests via an `X-Sona-Token` header.

At this point, you might start asking some valid questions, including "Why was this base64 encoded?" This appears to be a classic case of security through obscurity. What I effectively wanted was to prevent the user from knowing what was in the token. However, a halfway decent security researcher would immediately realize this and attempt to abuse the fact. The token contains the following attributes: the user's ID, the expiration time for the token, and the permissions associated with the token. At this point in my read-through of the code, I was quite concerned. One could imagine the following cases that could cause unexpected token outcomes: extending the expiration date, masquerading as another user by changing the user ID, or even privilege escalation by changing the permissions in the token.

Oddly enough, these cases didn't end up applying as I feared they might. I did something a bit clever, not to be confused with good, that reduced the surface area of the attack. When a user logs in, a token will be generated. This token would then actually be stored in the database in its initially created state. When a user used the `X-Sona-Token`, it would check to see if that specific token string was issued in the past. If it weren't, it would reject the request. It would also prune the requests over time. So, while it is not good in practice, what this would mean is that to escalate your privileges, you would have to use a formerly issued, valid, and non-expired token in your request. I think this code best summarizes this almost seemingly accidental handling of these escalation concerns.

```go
func (manager MySQLUserManager) ValidateUser(token string) bool {
	userId := GetTokenUser(token)
	tokens, _ := manager.getTokens(userId)
	found := -1

	for i, v := range tokens {
		if v == token {
			found = i
		}
	}

	if found == -1 {
		logManager.LogPrintf("Token not found for user %v", userId)
		return false
	}

	expired := TokenExpired(token)
	logManager.LogPrintf("Token expired %v", expired)
	go manager.pruneTokens(userId, tokens)

	return !expired
}
```

Some things that would have made this better are the following. The first group would be focused on reducing the risk of token interception. Storing the token in an HttpOnly cookie would have prevented JavaScript from reading it, reducing the risk of token theft via XSS. There would still be a risk of man-in-the-middle attacks, but since the server deployment used an SSL certificate, even that would be limited. Another thing that would have helped would be encrypting or signing the token with a server-side key. This would have prevented users from inspecting or modifying the token's contents, including user IDs and permissions.

## Looking forward

In many ways, I saw improvements from my last project, but in other ways, I saw a failure to properly build a web application. I had some obvious failings in deployment strategy, database management, and authorization. I found that many of these helped form my opinions on later projects. The risk was isolated to a project that was never commercialized, talk about a win. As this evaluation of the back-end comes to a close, we look to the future with an analysis of the front-end in the next blog.