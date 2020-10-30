---
title: 'TCP Transport'
date: '2020-10-02'
---

# TCP Transport
As a continuation of the transport layer series, in this blog we will be looking at our second transport layer protocol. Now that we have taken a look at UDP and understand its reliability issues its time to look at its more reliable alternative. This protocol is the transmission control protocol or TCP for short. TCP is ment to be a layered protocol architecture. In this case TCP is a layer that builds on IP much like UDP, but TCP is also ment to be extended by other protocols like telnet, FTP and HTTP. The philosophy of TCP puts empasis on a couple different roles that TCP plays.

### Basic Data Transfer
TCP should be able to transfer a continuous stream of octets in each direction by packaging some number of octets into segments for transmission. The availability of a push function should be defined for when users need to be sure all data they have sent has been transmitted.

### Reliability
TCP must be able to recover from data that is damanged, lost, duplicated or delivered out of order. This could happen for multiple reasons such as a faulty network connection or switch. The reason for loss is not particulary important what is important is that TCP is resiliant to such failures. This is one way in which TCP is drastically different from UDP as UDP had no protection of any such problem. In order to detect damaged segments a checksum is used.

### Flow Control
TCP provides a window. This window acts as a sizing mechanism that allows the receiver of data to control the amount of data the sender is allow to send at at time.

### Multiplexing
Since TCP wants to allow multiple processes on a single host to used the protocol, ports are used. In this case the host is resposible for binding the ports to the processes. The combination of network and host address form a socket. This socket acts as the identifier for one end of a TCP connection. A pair of sockets makes up a unique connection. While a socket identifies one end of a connection it does not have to be used in just one connection. A socket can be reused for multiple different connections at the same time.

### Connections
A connection is made up by the combination of sockets, sequence numbers and window sizes. This connection is uniquely identified by a pair of sockets. The connection must first be successfully established before two processes can communicate over TCP. This is done using a handshaking mechanism with clock-based sequence numbers to avoid erroneous initializations of connections. When the communication between the two processes is completed the connection is terminated or closed.

### Precedence and Security
TCP includes mechanisms for setting connection precedence and security. In the case of TCP users can indicate the security and precedence their communication will use. If this is not honored by both sides of the connection than a successful connection cannot be established.

One other important thing to note before moving on is that TCP introduces the concept of a Transmission Control Block or TCB for short. The TCB stores information about the connection on the host. In a linux based environment you can see this information by running the command `netstat -at` in a terminal.

## Reviewing the network protocol

### Fields
#### Source Port
16 bit source port number.

#### Destination Port
16 bit destination port number.

#### Sequence Number
32 bit sequence number of the first data octet in the segement. If SYN is present the sequence number is the initial sequence number (ISN) and the first data octect is ISN+1.

#### Acknowledgment Number
32 bit field that contains the value of the next sequence number the sender of the segments is expecting to recieve.

#### Data Offset
4 bit number that specifies where the data begins. This number represents the number of 32 bit words in the TCP header itself.

#### Reserved
6 bits that are reserved for future use.

#### Control bits
6 bits that take on any of the following

| Value | Meaning |
|-|-|
| URG | Urgent pointer field |
| ACK | Acknowledgment field |
| PSH | Push function |
| RST | Reset the function |
| SYN | Synchornize sequence numbers |
| FIN | No more data to transfer |

#### Window
16 bit field that specifies the number of data octets starting with the one indicated in the acknowledgment field which the sender is willing to accept.

#### Checksum
16 bit field which is the one's complement of the one's complement sum of all 16 bit words in the header and text. In the [UDP blog](http://ilusr.com/udp/) I talked more about calculating the checksum, a very similar calculation would happen for TCP.

#### Urgent Pointer
16 bit field that communicates the current value of the urgent pointer. This pointer points to the sequence number of the octet following the urgent data.

#### Options
Options is variable in size but must be a multiple of 8 bits in length. All options are included in the checksum. All options have a option-kind and may have an option length.

##### End of Option List
The end of option list has a Kind of 0. This option indicates the end of the options list. This option is only needed if the end of the options would not match up with the end of the TCP header. That is to say if there are extra bytes after the options this option must be provided.

##### No-Operation
The no-operation has a Kind of 1. This can be used between options; However, there is no guarantee that senders will use this option.

##### Maximum Segment Size
The maximum segment size has a Kind of 2 and a length of 4 bytes. This option communicates the maximum receive segment size to the TCP that sends this segment. This option can only be used in the initial connection request.

#### Padding
Padding is a variable sized field used to ensure that the header ends and data begins on a 32 bit boundary.

#### Data
The data that is being sent.

### Terminology

#### Send Sequence Variables
| Variable | Meaning |
|-|-|
| SND.UNA | send unacknowledged |
| SND.NXT | send next |
| SND.WND | send window |
| SND.UP | send urgent pointer |
| SND.WL1 | segment sequence number used for last window update |
| SND.WL2 | segment acknowledgement number used for last window update |
| ISS | initial send sequence number |

#### Recieve Sequence Variables
| Variable | Meaning |
|-|-|
| RCV.NXT | receive next |
| RCV.WND | receive window |
| RCV.UP | receive urgent pointer |
| IRS | initial receive sequence number |

#### Segment Variables
| Variable | Meaning |
|-|-|
| SEG.SEQ | segment sequence number |
| SEG.ACK | segement acknowledgment number |
| SEG.LEN | segument length |
| SEG.WND | segment window |
| SEG.UP | segment urgent pointer |
| SEG.PRC | segement precedence value |

#### Connection states
TCP is driven by different connection states. A connection moves from one connection state to another in response to events. The events a user can call to influence connection state are: OPEN, SEND, RECEIVE, CLOSE, ABORT, and STATUS. Information about the connection state can be found on the TCB.

TODO Diagram?

##### LISTEN
In the listen state socket is waiting for connection request from any remote TCP and port.

##### SYN-SENT
In the SYN-SENT state the socket is waiting for a matching connection request after having sent a connection request of its own.

##### SYN-RECEIVED
In the SYN-RECEIVED state the socket is waiting for a confirmation connection request acknowldgement after having both sent and received a connection request.

##### ESTABLISHED
In the ESTABLISHED state the socket is an open connection. This is the normal data transfer phase of the connection.

##### FIN-WAIT-1
In the FIN-WAIT-1 state the socket is waiting for a connection termination request from the remote TCP or an acknowledgement of the connection terminiation request that had previously been sent.

##### FIN-WAIT-2
In the FIN-WAIT-2 state the socket is waiting for a connection termiation request from the remote TCP.

##### CLOSE-WAIT
In the CLOSE-WAIT state the socket is waiting for a connection termination request from the local user.

##### CLOSING
In the CLOSING state the socket is waiting for a connection termiation request acknowledgment from the remote TCP.

##### LAST-ACK
In the LAST-ACK state the socket is waiting for an acknowledgment of the connection termination request that had previously been sent to the remote TCP.

##### TIME-WAIT
In the TIME-WAIT state the socket is waiting for enough time to pass to be sure the remote TCP received the acknoledgment of its connection termination request.

##### CLOSED
In the CLOSED state the socket has no connection.

#### Sequence Numbers
Sequence numbers are a key part of how TCP ensures no packet loss or duplication. In TCP every octet of data sent on the wire has a sequence number. Each of these sequence numbers can be acknowledged by the remote TCP. In the case of TCP acknowledgement is a cumulative mechanism. In the case of acknowledgment, if you acknowledge sequence N that means the receiving TCP has acknowledged all data octets up to but not including N. Sequence numbers occupy a finite space, however that space is rather large 0 - 2<sup>32</sup> - 1. Since the space a sequence number occupies is finite all arithmetic dealing with sequence numbers must be performed with modulo 2<sup>32</sup>.

Some examples of arithmetic required for dealing with sequence numbers includes the following.
* Determining that an acknowledgment refers to some sequence number sent but not acknowledged.
* Determining that all sequence numbers occupied by a segement have been acknowledged.
* Determining that an incoming segment contains sequence numbers that are expected.

When it comes to processing acknowledgments there are a couple different comparisions that are required.

| Variable | Meaning |
|-|-|
| SND:UNA | The oldest unacknowledged sequence number. |
| SND.NXT | The next sequence number to be sent. |
| SEG.ACK | An acknowledgement from the receiving TCP. |
| SEG.SEQ | The first sequence number of a segement. |
| SEG.LEN | The number of octets occupied by the data in the segement. |

With these variables you can combine values to produce additional information. For example, `SEG.SEQ+SEG.LEN-1` represents the last sequence number of a segement. Likewise you can tell if a segment on the retransmission queue is fully acknowledged. In this case if the sum of its sequence number and length is less or equal than the acknowledgement value in the incoming request. This could be represented in this way `SND.UNA < SEG.ACK =< SND.NXT`.

When it comes to processing recieved data a different set of comparisions are required.

| Variable | Meaning |
|-|-|
| RCV.NXT | The next sequence number expected on an incoming segment. This is the left or lower edge of the receive window |
| RVC.NXT+RCV.WND-1 | The last sequence number expected on an incoming segement. This is the right of upper edge of the receive window. |
| SEG.SEQ | The first sequence number occupied by the incoming segment. |
| SEG.SEQ+SEG.LEN-1 | The last sequence number occupied by the incoming segment. |

TCP can determine if a segment occupies a portion of a valid receive sequence using either `RCV.NXT =< SEG.SEQ < RCV.NXT+RCV.WND` or `RCV.NXT =< SEG.SEQ+SEG.LEN-1 < RCV.NXT+RCV.WND`. In the case of `RCV.NXT =< SEG.SEQ < RCV.NXT+RCV.WND` this operation is checking to see if the beginning of the segment falls in a window. In the case of `RCV.NXT =< SEG.SEQ+SEG.LEN-1 < RCV.NXT+RCV.WND` this operation is checking to see if the end of the segment falls in a window. One thing that can really complicate this logic is if the window size is zero or a zero segment exists. This is possible but a bit of an edge case.

There are a couple special cases when it comes to sequence numbers. In the case of TCP SYN and FIN are not subject to sequence numbers. SYN is always expected to occur before the first data octet while FIN is always expected to occur after the last data octet.

##### Initial Sequence number
* No restriction on connection reuse (incarnation)
* Common problem how does TCP identify duplicate segments from previous connections
    * Common cases in which this could be an issue: connection opened and closed in quick succession, connection breaks with loss of memory and then is reestablished.
* Even if TCP crashes and loses all knowledge of sequence numbers it has been using, this protocol must prevent segement reuse.
* When new connections are created an initial sequence number (ISN) generator is used. This generator selects a 32 bit ISN.
* This generator is tied to a 32 bit clock, this clocks lowest order bit is incremeted around every 4 microseconds. (Cycle time of 4.55 hours).
* Since segements will stay in the network no more than the Maxium Segement Lifetime (MSL) and the MSL is less than 4.55 hours we can assume that ISN's are unique.
* Each connection has a send sequence number and a receive sequence number.
* Initial send sequence number (ISS) is chosen by the data sending TCP
* Initial receive sequence number (IRS) is learned during the connection establishing procedure.
* In order to establish or initialize a connection both TCPs must synchronize on each others ISN.
* Exchange of connection establishing segments is done with a SYN and the sequence numbers.
* Synchronization requires each side to sned its own ISN and to recieve confirmation of it in an ACK.

Example flow

1. A --> B SYN sequence number is X
2. A <-- B ACK sequence number is X
3. A <-- B SYN sequence number is Y
4. A --> B ACK sequence number is Y

steps 2 and 3 can be combined in a single message. This the three way handshake.

* The three way handshake is necessary because sequence numbers are not tied to a global clock.
* Maxium Segment lifetime, is used to make sure TCP does not create a segment that carries a duplicated sequence number.
    * TCP must keep quiet for the MSL before it is allowed to assign any sequence numbers after recovering from a crash in which memory loss of sequence numbers in use occured.
    * Specification defaults this value at 2 minutes.

#### Establishing a connection

##### Simple Three-way handshake
| TCP A | TCP A Direction | Data | TCP B Direction | TCP B |
|-|-|-|-|-|
| CLOSED | | | | LISTEN |
| SYN-SENT | --> | <SEQ=100><CTL=SYN> | --> | SYN-RECEIVED |
| ESTABLISHED | <-- | <SEQ=300><ACK=101><CTL=SYN,ACK> | <-- | SYN-RECEIVED |
| ESTABLISHED | --> | <SEQ=101><ACK=301><CTL=ACK> | --> | ESTABLISHED |
| ESTABLISHED | --> | <SEQ=101><ACK=301><CTL=ACK><DATA> | --> | ESTABLISHED |

##### Simultaneous Three-way handshake
| TCP A | TCP A Direction | Data | TCP B Direction | TCP B |
| CLOSED | | | | CLOSED |
| SYN-SENT | --> | <SEQ=100><CTL=SYN> | In transit | |
| SYN-RECEIVED | <-- | <SEQ=300><CTL=SYN> | <-- | SYN-SENT |
| | In transit | <SEQ=100><CTL=SYN> | --> | SYN-RECIEVED |
| SYN-RECIEVED | --> | <SEQ=100><ACK=301><CTL=SYN,ACK> | In transit | |
| ESTABLISHED | <-- | <SEQ=300><ACK=101><CTL=SYN,ACK> | <-- | SYN-RECEIVED |
| | In transit | <SEQ=101><ACK=301><CTL=ACK> | --> | ESTABLISHED |

* Three-way handshake can recover from duplicate messages by using the reset (RST) function.
* half-open connections are connections in which one of the TCPs has closed or aborted the connection from its end without the knowledge of the other TCP. This can also happen if the connection has become desynchronized.

##### Recovery from a crash (half-open)
| TCP A | TCP A Direction | Data | TCP B Direction | TCP B |
| (Crash) | | | | | Last sent 300, last receive 100 |
| CLOSED | | | | | ESTABLISHED |
| SYN-SENT | --> | <SEQ=400><CTL=SYN> | --> | invalid |
| bad response | <-- | <SEQ=300><ACK=100><CTL=ACK> | <-- | ESTABLISHED |
| SYN-SENT | --> | <SEQ=100><CTL=RST> | --> | Abort |
| SYN-SENT | | | | CLOSED |
| SYN-SENT | --> | <SEQ=400><CTL=SYN> | --> | |

* Similar half open aborts can occur when one TCP tries to send a message to a crashed TCP.

##### Resets
* A reset must be sent whenever a segment arrives which is no intended for the current connection.
* If a connection does not exist then a reset should be sent in response to any incoming segment execpt another reset.
* If the connection is in a non-synchronized state and the incoming segment acknowledges something not yet sent a reset should be sent.
* If the connection is in a synchronized state any unacceptable segment must elicit only an empy acknowledgement segment containing the current send-sequence number and an acknowledgement indicating the next sequence number expected to be received.
* Reset segments are validated by checking their SEQ fields
* A reset is valid if the sequence number is in the window.
* Receiver of a reset validates the request then changes state.
* In the case the receiver is in the LISTEN state it ignores the request.
* If the receiver is in the SYN-RECEIVED state then they return to the LISTEN state.
* If neither of the above is true the receiver aborts the connection and goes to the CLOSED state.


##### Closing connection
* CLOSE operation means "I have no more data to send."
* A user who closes may continue to receive until he is told that the other side has closed as well.
* TCP will reliably deliver all buffers SENT before the connection was CLOSED.
* Users must keep reading connections they close for sending until the TCP says no more data.
* Close cases
    * Local user initiates the close
        * FIN segment constructed and placed on the outgoing segment queue.
        * No further SENDs from the user will be accepted by the TCP.
        * RECEIVEs are allowed in this state.
        * When other TCP has acknowledged the FIN and sent a FIN of its own the closing TCP can ACK this FIN.
    * TCP receives a FIN from the network
        * Unsolicited FIN from the network.
        * User responses with a CLOSE
        * If ACK does not come a user timeout is used to abort the connection.
    * both users close simultaneously
        * Both sides echange FIN segments.
        * After both sides have received ACKs the connection will be deleted.

#### Precednece and security
* Intent is that connection between ports is operating on same security and compartment values.
* A connection attempt with mismatched security/compartment values must be rejected by sending a reset.

#### Data Communication
* data is communicated by the exchange of segments.
* Since segments can be lost due to errors or network congestion, TCP uses retransmission.
    * duplicate segments may arrive due to retransimission.
* Sender keeps track of next sequence number in SND.NXT
* Receiver keeps track of next sequence number to expect using RCV.NXT.
* Sender keeps track of the oldest unacknowledged sequence number in SND.UNA.
* Variables (SND.NXT, RCV.NXT) are advanced by the length of data in the segment.
* retransmission timeout is dynamically determined.
* large windows encourages transmissions.
* small windows can restrict the transmission of data to the point of introducing a round trip delay between each new segment.
* Sending TCP must send at least one octet of data even if the window size is zero.

#### Interfaces
* Section documents proposed interface for TCP
* User Commands
    * Open - opens the TCP connection.
    * Send - sends data in a buffer. Send is considered an error if it occurs on a connection that is not open. Multiple sends can be called before closing connection.
    * Receive - Waits for data and returns to program once buffer is filled.
    * Close - causes connection to be closed.
    * Status - Information from the TCB about the connection.
        * foreign socket
        * local connection name
        * receive window
        * send window
        * connection state
        * number of buffers awaiting ack
        * number of buffers pending receipt
        * urgent state
        * precedence
        * security
        * transmission timeout
    * Abort - cancels all pending SENDs and RECEIVEs
* TCP to user messages
    * When TCP signals a user program it should provide the following information
        * Local Connection Name
        * Response String
        * Buffer Address
        * Byte count
        * Push flag
        * Urgent flag

#### Event Processing
* Activity of TCP can be defined as responding to events.
* There are 3 different kind of events
    * user calls
        * OPEN
        * SEND
        * RECEIVE
        * CLOSE
        * ABORT
        * STATUS
    * arriving segments
        * SEGMENT ARRIVES
    * timeouts
        * USER TIMEOUT
        * RETRANSMISSION TIMEOUT
        * TIME-WAIT TIMEOUT

### Example of a standard library
Much like UDP, TCP is a standard protocol and it is relatively easy to find support for it in most languages standard library. Below are just a few examples of programming languages and their associated TCP library.

* nodejs - https://nodejs.org/api/net.html
* Java - https://docs.oracle.com/javase/8/docs/api/java/net/Socket.html
* Go - https://golang.org/pkg/net/
* Python - https://docs.python.org/3/library/socket.html
* Rust - https://doc.rust-lang.org/beta/std/net/struct.TcpStream.html

### Example of a client-server application using the protocol

### Look at the results in a network capture

### Interesting finds

* WoW uses TCP instead of UDP
* HTTP is usually based on TCP

### References

* https://tools.ietf.org/html/rfc793