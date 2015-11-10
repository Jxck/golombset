all: test.exe golombset

check: test.exe
	./test.exe

test.exe: test.c golombset.h
	$(CC) -Wall -g test.c -o $@

golombset: cmd.c golombset.h
	$(CC) -Wall -g cmd.c -o $@

clean:
	rm -rf test.exe golombset golombset.dSYM test.exe.dSYM

.PHONY: check clean
