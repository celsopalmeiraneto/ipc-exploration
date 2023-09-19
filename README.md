# IPC Exploration

The other day I was reading how systemd uses Unix sockets to speed up some units by making the socket available and actually deferring the boot of a service upon something actually using the socket.

Reading that article made me think that I have never actually implemented IPC using sockets, why not?

This is a really simple example of an unidirectional IPC, let's say a given process spawns a bunch of processes responsible for reading data from sensors, the parent process, then, does something with the data.
