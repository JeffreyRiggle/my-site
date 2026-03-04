---
title: 'Something about dbs'
date: '2025-03-02'
---

## Sona server BE (better subtitle)

Building off the last blog, I want to focus on the specific decisions of my backend for the SONA project. Looking back on this project I see growth in some areas, but I also see new areas of weakness emerge. Now there are enough weaknesses in this that I cannot cover them all. Since I approached this like a code review things like commenting style etc had made my notes. To avoid making this a painful droll of a code review I will focus on the most agrejous issues.

## Starting off on a good note

While I didn't realize it at the timem there was some maturity in my process this time around. Because my goal had a goal beyond learning or a sense of misplaced pride in building everything myself, I used third party libraries. Had I followed the path of my last project, I might have been tempted to build my own abstraction to create a RESTful API but instead I used [gorrila/mux](https://github.com/gorilla/mux). This saved me hours if not days of dealing with the HTTP library directly and allowed me to focus on the core problem. In addition to this library, I used many others like database drivers and aws clients.

Another very positive aspect was avoiding creating a premature abstraction in an attempt to solve all problems. In the past I might have been tempted to create a web hook library that aimed to solve everyones problems with webhooks. This would have inevitably failed and would end up not solving anyones problems with webhooks.

## Database hell

In this project I noticed a pattern. There was a deliberate effort to make this work in a way that allowed the end user to pick their desired technology. The way I see this now is a failed attempt to remove vendor lock in.

To get a bit more concrete about this I supported 3 major databases Datastore, MySQL, and DynamoDB. This is a terrible straddle between relational and non-relational databases that I will come back to. If the stated goal was to avoid vendor lockin the usual culprit is the cloud vendor not the database vendor. Making the system work well on a single database like MySQL, Postgres or MongoDB would have achived the same goal without the consequences.

### Relational vs Non-Relational

There is no shortage of documentation and blogs talking about the differences between relational and non-relational databases. However my experience in this project taught me something a bit different. While you can make either model work behind a single interface, one or both implementations will be inefficient. I don't think I respected that enough going into this. Abstraction is powerful tool, but it can also make you blind to mandatory inefficiencies inherited from it. These may be acceptable, but there is no such thing as a free abstraction. In my abstraction I wanted to support any type of query on any column. The net result was implementation misses in both implementations.

### Failures of Non-Relational representation

To limit scope I will focus only on the failings of my DynamoDB implementation. If you know anything about DynamoDB you will know that you can either query or scan the database. A super quick recap, queries are the optimal route for getting data out of the database because they use the databases partions effecively, but you can do a suboptimal scan for performing other queries you may need. Notice the key focus is on performance. If you want to use DynamoDB effectively you should query not scan. However, in order to do a query you need to filter on an index and indexes have to be predefined. This means a well designed DynamoDB deployment knows its query patterns. What this abstraction did was allow for creating dynamic queries on any attribute which might not have an index. The net result was having to scan for all my incident search requests. At scale this would have shown as a performance problem.

### But you did better on MySQL right?

While I do see this abstraction working out much better, I do see some implemenation misses. To support dynamic queries I created the following data structure.

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

As you might be able to see this _should_ allow you to chain together a bunch of filter conditions with a junction (AND/OR). This has two issues, the first is similar to the NoSQL problem. While relational databases can do these queries in a query they tend to do better when you generate indexes. In this case there is no good index to create. The secondary issue is somewhat hard to look at. It appears that the implemenation missed the requirement. Do you see the issue with this code? I will give you a hint it has to do with the junction.

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

One last commentary on this solution. As defined in the prior blog post any incident can have any number of attributes. The way I build this data model was the following

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

Conventional wisdom says this is the correct solution and it likely was. However, it may have been interesting the benchmark the difference between this model and a more non-standard model.

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

The insight being that all queries had to JOIN these two tables. Combinine these may have had some benefit. The downsides being the insert cost in time and required runtime management of substructure.

## Identity as an afterthought

A feature I bolted on later was authentication and authorization. This project highlights the danger in roll your own authentication and authorization. Now before I completely rip apart the solution, I would like to point out one thing I handled passibly. I did have the awareness not to store user passwords as plaintext in the database. Instead I salted the password with the users email and ran that on a sha256 hash before putting it in the database which is better than nothing.

### Tokens matter.

The way I permissioned the application was, once a user did a successful login they would be handed a token. No not a sensible JWT. This was a special token of my own creation. This token contained some key data and was base64 encoded and sent back to the client. The client would then have to provide this token in subsequent API requests via a `X-Sona-Token` header. 

At this point you might start asking some valid questions like "Why was this base64 encoded?" This appears to me to be classic security through obsurity. What I effecitvely wanted was to prevent the user from knowing what was in the token. However a halfway decent security researcher would immediately realize this and attempt to abuse the fact. The token contains the following attributes: the users id, the expiration time of the token and the permissions associted with the token. At this point in my read through of the code I was quite concerned. One could imagine any of the following cases that could cause unexpected token outcomes: extending expiration date, masqurading as another user by changing the id, or even priviledge escalation by changing the permissions in the token. 

Oddly enough these cases didn't end up applying as I feared they might. I did something a bit clever, not to be confused with good, that reduced the surface area of the attack. When you logged in the token would be generated. This token would then actually be stored in the database in its initially created state. When a user used the `X-Sona-Token` it would look to see if that specific token string was issued in the past. If it wasn't it would reject the request. It would also prune the requests overtime. So while it is not good in practice what this would mean is that you escalate your priviledges you would have to use a formerly issued valid and non expired token in your request. I think this code best summarizes this almost seemingly accidental handling of these escalation concerns

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

Some things that would have made this better are the following. The first group would be around reducing the risk of token inteception. Had this been stored in a http only cookie instead of a standard header, then the impact of XSS would have been diminished. There would have still been a risk for man in the middle attacks but since the server deployment used a ssl certifiate even that would be limited. Another thing that would have helped would be encrypting the token with a private key. This encryption would have prevented malicious actors from getting user id and permission sets from tokens.

## Looking forward

In many ways I saw improvements from my last project, but in other ways I saw a failure to properly build a web application. I had some obvious failings in deployment strategy, database management and authorization. I found that many of these helped form my opinions on later projects. Also the risk was isolated to a project that was never comercializid, talk about a win. As this evaluation of the back-end comes to and end we look to the future with an analysis of the front-end in the next blog.