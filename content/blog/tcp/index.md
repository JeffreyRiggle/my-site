---
title: 'TCP Transport'
date: '2020-10-02'
---

# TCP Transport
* Transmission Control Protocol
* Second protocol
* More reliable than UDP
* Fits into a layered protocol architecture
* Takes roles in different areas
    * Basic Data Transfer
        * Able to transfer a continuous stream of octets in each direction by packaging some number of octets into segments for transmission through the internet system.
        * A push function is defined for when users need to be sure all data they have submitted has been transmitted.
    * Reliability
        * TCP must recover from data that is damaged, lost, duplicated or delivered out of order.
        * Sequence numbers and acknowledgements (ACK) are used to handle duplicates, lost packages and delivery order.
        * Checksums are used to detect damaged segments.
    * Flow Control
        * TCP allows the receiver to control the amount of data sent by the sender.
        * This is done with a window.
    * Multiplexing
        * In order to allow many processes on a single host to use TCP addresses or ports are used.
        * The combination of the network and host address from the internet form a socket.
        * A pair of sockets uniquely identifies a connect.
        * A socket may be simultaneously used by multiple connections.
        * Binding of ports to process is handled by the host.
    * Connections
        * Is the combiniation of sockets, sequence numbers and window sizes.
        * A connection is uniquely specified by a pair of sockets
        * In order for two processes to communicate over TCP they must first establish a connection.
        * When communication is complete the connection is terminated or closed.
        * Since the hosts and network can be unreliable a handshake mechanism with clock-based sequence numbers is used to avoid erroneous initialization of connections.
    * Precedence and Security
        * Users of TCP may indicate the security and precedence of their communication.
* Is able to support higher level protocols (Telnet, FTP, HTTP)
* A Transmission Control Block (TCB) stores information about the connection.

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
16 bit field which is the one's complement of the one's complement sum of all 16 bit words in the header and text. 

* This appears very similar to the UDP checksum it might be a good idea just to refer back to that.
TODO Expand on this.

#### Urgent Pointer
16 bit field that communicates the current value of the urgent pointer. This pointer points to the sequence number of the octet following the urgent data.

#### Options
Options is variable in size but must be a multiple of 8 bits in length. All options are included in the checksum. All options have a option-kind and may have an option length.

##### End of Option List
* Kind = 0
* indicates the end of the option list.
* Might now be the end of the header based off of the data offset field.
* Used at the end of all options.
* only needed if the end of options would not match up with the end of the TCP header.

##### No-Operation
* Kind = 1
* May be used between options.
* There is no guarantee that sends will use this option.

##### Maximum Segment Size
* Kind = 2
* Length = 4
* Has Maximum Segement Size option data.
    * data is 16 bits
    * Communicates the maximum receive segment size at the TCP which sends this segment.
    * Must only be sent in the initial connection request.

#### Padding
Padding is a variable sized field used to ensure that the header ends and data begins on a 32 bit boundary.

#### Data
The data you would like to send.

### Terminology?

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

### References

* https://tools.ietf.org/html/rfc793