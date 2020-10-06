---
title: 'TCP Transport'
date: '2020-10-02'
---

# TCP Transport
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

### Reviewing the network protocol
* Header format (see section 3.1)

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