#include "../SourceCodeFiles/greater_root.c"
#include <stdio.h>
#include <string.h>

int main(int argc, const char** argv) {
	printf("%i\n", 2);
	double a = 2;
	double b = 5;
	double c = 2;
	if (0 == greater_root(a,b,c)) {
		printf("%lf\n", "P");
	} else {
		printf("%lf\n", "F");
	}
	return 0;
}
