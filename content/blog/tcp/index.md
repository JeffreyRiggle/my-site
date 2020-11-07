---
title: 'TCP Transport'
date: '2020-11-07'
---

# TCP Transport
As a continuation of the transport layer series, in this blog, we will be looking at our second transport layer protocol. Now that we have taken a look at UDP and understand its reliability issues it's time to look at its more reliable alternative. This protocol is the transmission control protocol or TCP for short. TCP is meant to be a layered protocol architecture. In this case, TCP is a layer that builds on IP much like UDP, but TCP is also meant to be extended by other protocols like telnet, FTP, and HTTP. The philosophy of TCP emphasizes a couple of different roles that TCP plays.

### Basic Data Transfer
TCP should be able to transfer a continuous stream of octets in each direction by packaging some number of octets into segments for transmission. The availability of a push function should be defined for when users need to be sure all data they have sent has been transmitted.

### Reliability
TCP must be able to recover from data that is damaged, lost, duplicated, or delivered out of order. This could happen for multiple reasons such as a faulty network connection or switch. The reason for the loss is not particularly important what is important is that TCP is resilient to such failures. This is one way in which TCP is drastically different from UDP as UDP had no protection of any such problem. To detect damaged segments a checksum is used.

### Flow Control
TCP provides a window. This window acts as a sizing mechanism that allows the receiver of data to control the amount of data the sender is allowed to send at a time.

### Multiplexing
Since TCP wants to allow multiple processes on a single host to use the protocol, ports are used. In this case, the host is responsible for binding the ports to the processes. The combination of network and host address form a socket. This socket acts as the identifier for one end of a TCP connection. A pair of sockets makes up a unique connection. While a socket identifies one end of a connection it does not have to be used in just one connection. A socket can be reused for multiple different connections at the same time.

### Connections
A connection is made up of the combination of sockets, sequence numbers, and window sizes. This connection is uniquely identified by a pair of sockets. The connection must first be successfully established before two processes can communicate over TCP. This is done using a handshaking mechanism with clock-based sequence numbers to avoid erroneous initializations of connections. When the communication between the two processes is completed the connection is terminated or closed.

### Precedence and Security
TCP includes mechanisms for setting connection precedence and security. In the case of TCP, users can indicate the security and precedence their communication will use. If this is not honored by both sides of the connection then a successful connection cannot be established.

One other important thing to note before moving on is that TCP introduces the concept of a Transmission Control Block or TCB for short. The TCB stores information about the connection on the host. In a Linux based environment, you can see this information by running the command `netstat -at` in a terminal.

## Reviewing the network protocol

### Fields
#### Source Port
16-bit source port number.

#### Destination Port
16-bit destination port number.

#### Sequence Number
32-bit sequence number of the first data octet in the segment. If SYN is present the sequence number is the initial sequence number (ISN) and the first data octet is ISN+1.

#### Acknowledgment Number
32-bit field that contains the value of the next sequence number the sender of the segments is expecting to receive.

#### Data Offset
4-bit number that specifies where the data begins. This number represents the number of 32-bit words in the TCP header itself.

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
| SYN | Synchronize sequence numbers |
| FIN | No more data to transfer |

#### Window
16-bit field that specifies the number of data octets starting with the one indicated in the acknowledgment field which the sender is willing to accept.

#### Checksum
16-bit field which is the one's complement of the one's complement sum of all 16-bit words in the header and text. In the [UDP blog](http://ilusr.com/udp/), I talked more about calculating the checksum, a very similar calculation would happen for TCP.

#### Urgent Pointer
16-bit field that communicates the current value of the urgent pointer. This pointer points to the sequence number of the octet following the urgent data.

#### Options
Options are variable in size but must be a multiple of 8 bits in length. All options are included in the checksum. All options have an option-kind and may have an option length.

##### End of Option List
The end of the options list has a Kind of 0. This option indicates the end of the options list. This option is only needed if the end of the options would not match up with the end of the TCP header. That is to say, if there are extra bytes after the options this option must be provided.

##### No-Operation
The no-operation has a Kind of 1. This can be used between options; However, there is no guarantee that senders will use this option.

##### Maximum Segment Size
The maximum segment size has a Kind of 2 and a length of 4 bytes. This option communicates the maximum receive segment size to the TCP that sends this segment. This option can only be used in the initial connection request.

#### Padding
Padding is a variable-sized field used to ensure that the header ends and data begins on a 32-bit boundary.

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
| SND.WL2 | segment acknowledgment number used for last window update |
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
| SEG.ACK | segment acknowledgment number |
| SEG.LEN | segment length |
| SEG.WND | segment window |
| SEG.UP | segment urgent pointer |
| SEG.PRC | segment precedence value |

#### Connection states
TCP is driven by different connection states. A connection moves from one connection state to another in response to events. The events a user can call to influence connection state are: OPEN, SEND, RECEIVE, CLOSE, ABORT, and STATUS. Information about the connection state can be found on the TCB.

##### LISTEN
In the listen state socket is waiting for a connection request from any remote TCP and port.

##### SYN-SENT
In the SYN-SENT state, the socket is waiting for a matching connection request after having sent a connection request of its own.

##### SYN-RECEIVED
In the SYN-RECEIVED state, the socket is waiting for a confirmation connection request acknowledgment after having both sent and received a connection request.

##### ESTABLISHED
In the ESTABLISHED state, the socket is an open connection. This is the normal data transfer phase of the connection.

##### FIN-WAIT-1
In the FIN-WAIT-1 state, the socket is waiting for a connection termination request from the remote TCP or an acknowledgment of the connection termination request that had previously been sent.

##### FIN-WAIT-2
In the FIN-WAIT-2 state, the socket is waiting for a connection termination request from the remote TCP.

##### CLOSE-WAIT
In the CLOSE-WAIT state, the socket is waiting for a connection termination request from the local user.

##### CLOSING
In the CLOSING state the socket is waiting for a connection termination request acknowledgment from the remote TCP.

##### LAST-ACK
In the LAST-ACK state, the socket is waiting for an acknowledgment of the connection termination request that had previously been sent to the remote TCP.

##### TIME-WAIT
In the TIME-WAIT state, the socket is waiting for enough time to pass to be sure the remote TCP received the acknowledgment of its connection termination request.

##### CLOSED
In the CLOSED state, the socket has no connection.

#### Sequence Numbers
Sequence numbers are a key part of how TCP ensures no packet loss or duplication. In TCP every octet of data sent on the wire has a sequence number. Each of these sequence numbers can be acknowledged by the remote TCP. In the case of TCP acknowledgment is a cumulative mechanism. In the case of acknowledgment, if you acknowledge sequence N that means the receiving TCP has acknowledged all data octets up to but not including N. Sequence numbers occupy a finite space, however that space is rather large 0 - 2<sup>32</sup> - 1. Since a sequence number occupies a finite amount of space, all arithmetic dealing with sequence numbers must be performed with modulo 2<sup>32</sup>.

Some examples of arithmetic required for dealing with sequence numbers include the following.
* Determining that an acknowledgment refers to some sequence number sent but not acknowledged.
* Determining that all sequence numbers occupied by a segment have been acknowledged.
* Determining that an incoming segment contains sequence numbers that are expected.

When it comes to processing acknowledgments there are a couple of different comparisons that are required.

| Variable | Meaning |
|-|-|
| SND:UNA | The oldest unacknowledged sequence number. |
| SND.NXT | The next sequence number to be sent. |
| SEG.ACK | An acknowledgment from the receiving TCP. |
| SEG.SEQ | The first sequence number of a segment. |
| SEG.LEN | The number of octets occupied by the data in the segment. |

With these variables, you can combine values to produce additional information. For example, `SEG.SEQ+SEG.LEN-1` represents the last sequence number of a segment. Likewise, you can tell if a segment on the retransmission queue is fully acknowledged. In this case, if the sum of its sequence number and length is less or equal to the acknowledgment value in the incoming request. This could be represented in this way `SND.UNA < SEG.ACK =< SND.NXT`.

When it comes to processing received data a different set of comparisons is required.

| Variable | Meaning |
|-|-|
| RCV.NXT | The next sequence number expected on an incoming segment. This is the left or lower edge of the receive window |
| RVC.NXT+RCV.WND-1 | The last sequence number expected on an incoming segment. This is the right upper edge of the receive window. |
| SEG.SEQ | The first sequence number occupied by the incoming segment. |
| SEG.SEQ+SEG.LEN-1 | The last sequence number occupied by the incoming segment. |

TCP can determine if a segment occupies a portion of a valid receive sequence using either `RCV.NXT =< SEG.SEQ < RCV.NXT+RCV.WND` or `RCV.NXT =< SEG.SEQ+SEG.LEN-1 < RCV.NXT+RCV.WND`. In the case of `RCV.NXT =< SEG.SEQ < RCV.NXT+RCV.WND` this operation is checking to see if the beginning of the segment falls in a window. In the case of `RCV.NXT =< SEG.SEQ+SEG.LEN-1 < RCV.NXT+RCV.WND` this operation is checking to see if the end of the segment falls in a window. One thing that can complicate this logic is if the window size is zero or a zero segment exists. This is possible but a bit of an edge case.

There are a couple of special cases when it comes to sequence numbers. In the case of TCP SYN and FIN are not subject to sequence numbers. SYN is always expected to occur before the first data octet while FIN is always expected to occur after the last data octet.

##### Initial Sequence number
The initial sequence number or ISN for short is used to help TCP identify duplicate segments from previous connections. This kind of problem and typically happen when a connection is opened and closed in quick succession or when a connection breaks with loss of memory and is reestablished. Even in the case of a crash with a total loss of knowledge of sequence numbers TCP must prevent segment reuse. To prevent segment reuse an ISN generator is used to create a rather unique number. This generator selects a 32-bit ISN based on a 32-bit clock. The 32-bit clock is incremented around every 4 microseconds giving the ISN cycle time a 4.55-hour window. Since 4.55 hours is not unique enough due to the long-lived nature of some TCP connections, the addition of a Maximum Segment Lifetime or MSL is required. The MSL is used to make sure TCP does not create a segment that carries a duplicated sequence number. TCP must keep quiet for the MSL before it is allowed to assign any sequence numbers after recovering from a crash in which memory loss of sequence numbers in use occurred. When the MSL is less than 4.55 hours we can assume that ISN's are unique. Every connection has a send sequence number and a receive sequence number. The initial send sequence number or ISS is decided by the data sending TCP. The initial receive sequence number or IRS is learned during the connection establishing procedure. For a TCP connection to be established or initialized both TCPs must synchronize based on each other's ISN. This exchange of segments is done with a SYN and the sequence numbers. The process of synchronization requires each TCP to send its ISN and receive confirmation of it in an ACK.

Example flow

1. A --> B SYN sequence number is X
2. A <-- B ACK sequence number is X
3. A <-- B SYN sequence number is Y
4. A --> B ACK sequence number is Y

steps 2 and 3 can be combined in a single message. This the three-way handshake.

#### Establishing a connection
Since TCP is not able to be tied to a global clock for ISN generation, the process of exchanging ISNs is done through a three-way handshake. Below are some examples of how this handshake works.

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
|-|-|-|-|-|
| CLOSED | | | | CLOSED |
| SYN-SENT | --> | <SEQ=100><CTL=SYN> | In transit | |
| SYN-RECEIVED | <-- | <SEQ=300><CTL=SYN> | <-- | SYN-SENT |
| | In transit | <SEQ=100><CTL=SYN> | --> | SYN-RECIEVED |
| SYN-RECIEVED | --> | <SEQ=100><ACK=301><CTL=SYN,ACK> | In transit | |
| ESTABLISHED | <-- | <SEQ=300><ACK=101><CTL=SYN,ACK> | <-- | SYN-RECEIVED |
| | In transit | <SEQ=101><ACK=301><CTL=ACK> | --> | ESTABLISHED |

The three-way handshake allows for recovery from duplicate messages by using the reset function.

##### Recovery from a crash (half-open)

| TCP A | TCP A Direction | Data | TCP B Direction | TCP B |
|-|-|-|-|-|
| (Crash) | | | | | Last sent 300, last receive 100 |
| CLOSED | | | | | ESTABLISHED |
| SYN-SENT | --> | <SEQ=400><CTL=SYN> | --> | invalid |
| bad response | <-- | <SEQ=300><ACK=100><CTL=ACK> | <-- | ESTABLISHED |
| SYN-SENT | --> | <SEQ=100><CTL=RST> | --> | Abort |
| SYN-SENT | | | | CLOSED |
| SYN-SENT | --> | <SEQ=400><CTL=SYN> | --> | |

##### Resets
Resets are used to reset the connection in the case of invalid or unexpected data. For example, if a segment arrives which is not intended for the current connection, or the connection does not exist then a reset must be sent. Another case in which a reset should be sent would be when the connection gets into a non-synchronized state. An example of this state would be a TCP receiving an acknowledgment for a segment that has not been sent yet. To validate a reset the sequence fields are used. If the sequence number is in the window then the reset is considered valid. Once a receiver validates a reset request it then changes state. In the case that the receiver was in the LISTEN state the reset request is ignored. In the case that the receiver is in the SYN-RECEIVED state they will return to the LISTEN state. In all other cases, the receiver will abort the connection and go to the CLOSED state.

##### Closing connection
In the case of TCP, the CLOSE operations signal that "I have no more data to send." In this case, the issuer of the close request may continue to receive data until they are told that the other side has closed the connection as well. By doing this TCP ensures that all data buffers sent before the connection was closed had been delivered. There are a couple of cases in which a connection can be closed.

The first case is when the local user initiates the close. In this case, a FIN segment is created and placed on the outgoing segment queue. Past this point no further SENDs from the user will be accepted, only receives are allowed from this state. When the other TCP has acknowledged the FIN and sent a FIN of its own the closing TCP can ACK the FIN and end the connection.

The second case is when a TCP receives a FIN from the network. This is FIN is considered unsolicited. In this case, the TCP that received the FIN will respond with a CLOSE. If an ACK does not come within a timeout then the connection is aborted.

The third case is when both sides of the connection close at the same time. In this case, both sides exchange FIN segments. Once both sides have received ACKs the connection will be deleted.

#### Precedence and security
Precedence and security are used to make sure the connection between ports are operating on the same security and compartment values. Any connection attempt with mismatched security or compartment values must be rejected by sending a reset.

#### Data Communication
TCP is a data communication protocol, so the exchange of data is very important. In the case of TCP data is communicated by the exchange of segments. Unlike with UDP TCP uses retransmission to handle the loss of segments due to errors or network congestion. Since TCP does use retransmission duplicate segments can arrive but this is not an issue due to the way segments are acknowledged. In these cases, the sender keeps track of the next expected sequence number in the SND.NXT while the receiver keeps track of the next sequence number in the RCV.NXT. The sender also keeps track of the oldest unacknowledged sequence number in the SND.UNA. One important thing to note is that SND,NXT and RCV.NXT is incremented by the length of data in the segment.

When sending data over TCP an important thing to consider is the window size. In the case of a large window transmissions are encouraged, but in the case of a small window transmission of data can be restricted to the point of introducing a round trip delay.

#### Interfaces
* User Commands
    * Open - opens the TCP connection.
    * Send - sends data in a buffer. Send is considered an error if it occurs on a connection that is not open. Multiple sends can be called before closing the connection.
    * Receive - Waits for data and returns to the program once the buffer is filled.
    * Close - causes a connection to be closed.
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
The activity of TCP can be defined as responding to events. In the case of TCP, there are 3 different kinds of events.

* User Calls
    * OPEN
    * SEND
    * RECEIVE
    * CLOSE
    * ABORT
    * STATUS
* Arriving Segments
    * SEGMENT ARRIVES
* Timeouts
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
https://github.com/JeffreyRiggle/tcp-example-app

This application is very similar to the one covered in the last blog about UDP. The notable differences in this example are: there is a disconnect button, and the application uses TCP instead of UDP.

### Look at the results in a network capture
Similar to the UDP analysis we will be using [Wireshark](https://www.wireshark.org/) to look at the network captures. For more information on install and setup see the previous blog.

#### Initial connection
In this case, we can see a simple three-way handshake occurs between the connecting client at port 50174 and the server on port 7000.

| Source Port | Destination Port | Flags | Notes | Content |
|-|-|-|-|-|
| 50174 | 7000 | SYN | Initial connection request from the client with an ISN of 1047673890 | 0000   00 00 00 00 00 00 00 00 00 00 00 00 08 00 45 00   ..............E.<br>0010   00 3c ad db 40 00 40 06 8e de 7f 00 00 01 7f 00   .<.Û@.@..Þ......<br>0020   00 01 c3 fe 1b 58 3e 72 3c 22 00 00 00 00 a0 02   ..Ãþ.X>r<".... .<br>0030   ff d7 fe 30 00 00 02 04 ff d7 04 02 08 0a 66 e1   ÿ×þ0....ÿ×....fá<br>0040   a0 f1 00 00 00 00 01 03 03 07                      ñ........<br> |
| 7000 | 50174 | SYN, ACK | Acknowledge the connection and provide ISN 3883755340 | 0000   00 00 00 00 00 00 00 00 00 00 00 00 08 00 45 00   ..............E.<br>0010   00 3c 00 00 40 00 40 06 3c ba 7f 00 00 01 7f 00   .<..@.@.<º......<br>0020   00 01 1b 58 c3 fe e7 7d 67 4c 3e 72 3c 23 a0 12   ...XÃþç}gL>r<# .<br>0030   ff cb fe 30 00 00 02 04 ff d7 04 02 08 0a 66 e1   ÿËþ0....ÿ×....fá<br>0040   a0 f2 66 e1 a0 f1 01 03 03 07                      òfá ñ.... |
| 50174 | 7000 | ACK | Acknowledge the ISN | 0000   00 00 00 00 00 00 00 00 00 00 00 00 08 00 45 00   ..............E.<br>0010   00 34 ad dc 40 00 40 06 8e e5 7f 00 00 01 7f 00   .4.Ü@.@..å......<br>0020   00 01 c3 fe 1b 58 3e 72 3c 23 e7 7d 67 4d 80 10   ..Ãþ.X>r<#ç}gM..<br>0030   02 00 fe 28 00 00 01 01 08 0a 66 e1 a0 f2 66 e1   ..þ(......fá òfá<br>0040   a0 f2                                              ò |


#### Client sending a message
In this case, we send a simple hello world message to the server. Just like in the UDP example the client sends a custom byte structure while the server sends a JSON response.

| Source Port | Destination Port | Flags | Notes | Content |
|-|-|-|-|-|
| 50174 | 7000 | PSH,ACK | The client is sending a hello world message to the server. | 0000   00 00 00 00 00 00 00 00 00 00 00 00 08 00 45 00   ..............E.<br>0010   00 41 ad df 40 00 40 06 8e d5 7f 00 00 01 7f 00   .A.ß@.@..Õ......<br>0020   00 01 c3 fe 1b 58 3e 72 3c 24 e7 7d 67 65 80 18   ..Ãþ.X>r<$ç}ge..<br>0030   02 00 fe 35 00 00 01 01 08 0a 66 f1 44 8d 66 e1   ..þ5......fñD.fá<br>0040   a1 52 02 48 65 6c 6c 6f 20 57 6f 72 6c 64 21      ¡R.Hello World! |
| 7000 | 50174 | PSH,ACK | The server acknowledges the message and sends a message of its own. | 0000   00 00 00 00 00 00 00 00 00 00 00 00 08 00 45 00   ..............E.<br>0010   00 7b 8c 49 40 00 40 06 b0 31 7f 00 00 01 7f 00   .{.I@.@.°1......<br>0020   00 01 1b 58 c3 fe e7 7d 67 65 3e 72 3c 31 80 18   ...XÃþç}ge>r<1..<br>0030   02 00 fe 6f 00 00 01 01 08 0a 66 f1 44 8e 66 f1   ..þo......fñD.fñ<br>0040   44 8d 7b 22 69 74 65 6d 73 22 3a 5b 7b 22 74 69   D.{"items":[{"ti<br>0050   6d 65 22 3a 31 36 30 34 36 35 39 35 31 36 36 30   me":160465951660<br>0060   30 2c 22 6d 65 73 73 61 67 65 22 3a 22 48 65 6c   0,"message":"Hel<br>0070   6c 6f 20 57 6f 72 6c 64 21 22 7d 5d 2c 22 73 65   lo World!"}],"se<br>0080   67 6d 65 6e 74 22 3a 31 7d                        gment":1} |
| 50174 | 7000 | ACK | The client acknowledges the last message from the server. | 0000   00 00 00 00 00 00 00 00 00 00 00 00 08 00 45 00   ..............E.<br>0010   00 34 ad e0 40 00 40 06 8e e1 7f 00 00 01 7f 00   .4.à@.@..á......<br>0020   00 01 c3 fe 1b 58 3e 72 3c 31 e7 7d 67 ac 80 10   ..Ãþ.X>r<1ç}g¬..<br>0030   02 00 fe 28 00 00 01 01 08 0a 66 f1 44 8e 66 f1   ..þ(......fñD.fñ<br>0040   44 8e                                             D. |

#### Client disconnect
| Source Port | Destination Port | Flags | Notes | Content |
|-|-|-|-|-|
| 50174 | 7000 | FIN,ACK | Request to close connection from the client. | 0000   00 00 00 00 00 00 00 00 00 00 00 00 08 00 45 00   ..............E.<br>0010   00 34 ad e1 40 00 40 06 8e e0 7f 00 00 01 7f 00   .4.á@.@..à......<br>0020   00 01 c3 fe 1b 58 3e 72 3c 31 e7 7d 67 ac 80 11   ..Ãþ.X>r<1ç}g¬..<br>0030   02 00 fe 28 00 00 01 01 08 0a 66 f6 ea 0e 66 f1   ..þ(......föê.fñ<br>0040   44 8e                                             D. |
| 7000 | 50174 | FIN,ACK | Acknowledge close and request close from the server. | 0000   00 00 00 00 00 00 00 00 00 00 00 00 08 00 45 00   ..............E.<br>0010   00 34 8c 4a 40 00 40 06 b0 77 7f 00 00 01 7f 00   .4.J@.@.°w......<br>0020   00 01 1b 58 c3 fe e7 7d 67 ac 3e 72 3c 32 80 11   ...XÃþç}g¬>r<2..<br>0030   02 00 fe 28 00 00 01 01 08 0a 66 f6 ea 0e 66 f6   ..þ(......föê.fö<br>0040   ea 0e                                             ê. |
| 50174 | 7000 | ACK | Acknowledge the close connection from the server. | 0000   00 00 00 00 00 00 00 00 00 00 00 00 08 00 45 00   ..............E.<br>0010   00 34 ad e2 40 00 40 06 8e df 7f 00 00 01 7f 00   .4.â@.@..ß......<br>0020   00 01 c3 fe 1b 58 3e 72 3c 32 e7 7d 67 ad 80 10   ..Ãþ.X>r<2ç}g...<br>0030   02 00 fe 28 00 00 01 01 08 0a 66 f6 ea 0e 66 f6   ..þ(......föê.fö<br>0040   ea 0e                                             ê. |

### Interesting finds
While looking into this I did find a couple of interesting finds. One find that I was remotely aware of is that many variants of HTTP are built on TCP. One notable exception to that rule is the upcoming HTTP3 or QUICK which is built on a multiplexed UDP connection. Another interesting find was that many online games use TCP as the transmission protocol. The thing that was a bit surprising about this is that TCP adds a lot of overhead with all of the acknowledgments so I was unsure that an online game could perform at the speed expected with all that additional checking.

### References

* https://tools.ietf.org/html/rfc793