---
title: 'UDP Transport'
date: '2020-05-06'
---

# UDP Transport
This is the first in the transport layer series. In this blog we will look into the User Datagram Protocol or UDP for short. UDP is part of the Internet Protocol (IP) suite and resides in the application layer. UDP is an unreliable protocol, that is not to say it is bad it just does not guarantee packet delivery like some other protocols.


### Reviewing the network protocol
UDP is made up of 5 parts: Source Port, Destination Port, Length, Checksum and data octets.

#### Source Port
The source port is an optional field. This field indicates the port that the sending process is using to communicate.

#### Destination Port
This is the port has a meaning within the context of a particular internet destination address.

#### Length
Length is the number in octets of the user datagram including the header and the data. The minimum possible value for length is 8.

#### Checksum
The checksum is the 16-bit one's complement of the ones complement sum of a psuedo header using the IP header, the UDP header and the data. This is padded with zero octets and the end to make a multiple of two octets.

Example

Source IP address: 192.168.0.15
Destination IP address: 192.168.0.23
Source Port: 35
Destination Port: 40
Length: 10
Message: Hi

| value | Decimal | Binary | Hex |
| - | - | - | - |
| Source IP | 192.168 <br> 0.15 | 1100 0000 1010 1000 <br> 0000 0000 0000 1111 | C0 A8 <br> 00 0F |
| Destination IP | 192.168 <br> 0.23 | 1100 0000 1010 1000 <br> 0000 0000 0001 0111 | C0 A8 <br> 00 17 |
| Reserved/UDP | 0/17 | 0000 0000 0001 0001 | 00 11 |
| Padding | 0/10 | 0000 0000 0000 1010 | 00 0A |
| Source Port | 35 | 0000 0000 0010 0011 | 00 23 |
| Destination Port | 40 | 0000 0000 0010 1000 | 00 28 |
| Length | 10 | 0000 0000 0000 1010 | 00 0A |
| Data | Hi | 0100 1000 0110 1001 | 48 69 |
<br>

| Add up all numbers to generate psudo header |
| - |
| 1100 0000 1010 1000 |
| + |
| 0000 0000 0000 1111 |
| + |
| 1100 0000 1010 1000 |
| + |
| 0000 0000 0001 0111 |
| + |
| 0000 0000 0001 0001 |
| + |
| 0000 0000 0000 1010 |
| + |
| 0000 0000 0010 0011 |
| + |
| 0000 0000 0010 1000 |
| + |
| 0000 0000 0000 1010 |
| + |
| 0100 1000 0110 1001 |
| = |
| 1 1100 1010 0110 1111 |
<br>

| Since this number overflows split into two 16bit address spaces and add |
| - |
| 0000 0000 0000 0001 |
| + |
| 1100 1010 0110 1111 |
| = |
| 1100 1010 0111 0000 |

Take ones compliment to get checksum value.
<br>
**0011 0101 1000 1111**

#### Data Octets
The actual data you want to send in the packet.

| field | bit range |
|-|-|
| Source Port | 0-15 |
| Destination Port | 16-31 |
| Length | 32-47 |
| Checksum | 48-63 |
| Data octets | remaning |

https://tools.ietf.org/html/rfc768


### Building an example of the protocol

### Look at the results in a network capture

### Example of a standard library
* nodejs - https://nodejs.org/api/dgram.html
* Java - https://docs.oracle.com/javase/7/docs/api/java/net/DatagramSocket.html
* Go - https://golang.org/pkg/net/
* Python - https://docs.python.org/3/library/socket.html
* Rust - https://doc.rust-lang.org/std/net/struct.UdpSocket.html

### Example of a client server application using the protocol

### Interesting finds

### References
* https://tools.ietf.org/html/rfc768
* https://tools.ietf.org/html/rfc1122#page-9

