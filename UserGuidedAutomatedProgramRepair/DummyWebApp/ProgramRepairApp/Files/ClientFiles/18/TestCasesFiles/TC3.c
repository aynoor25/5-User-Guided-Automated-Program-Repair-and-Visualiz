#include "../SourceCodeFiles/greater_root.c"
#include <stdio.h>
#include <string.h>

int main(int argc, const char** argv) {
	printf("%i\n", 3);
	double a = 1;
	double b = 4;
	double c = 4;
	if (-2 == greater_root(a,b,c)) {
		printf("%s\n", "P");
	} else {
		printf("%s\n", "F");
	}
	return 0;
}
