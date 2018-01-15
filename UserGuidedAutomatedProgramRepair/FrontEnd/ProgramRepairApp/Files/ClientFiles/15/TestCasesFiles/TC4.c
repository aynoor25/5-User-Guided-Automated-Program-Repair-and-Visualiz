#include "../SourceCodeFiles/greater_root.c"
#include <stdio.h>
#include <string.h>

int main(int argc, const char** argv) {
	printf("%i\n", 4);
	double a = 1;
	double b = 3;
	double c = 2;
	if (-1 == greater_root(a,b,c)) {
		printf("%lf\n", "P");
	} else {
		printf("%lf\n", "F");
	}
	return 0;
}
