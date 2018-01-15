#include <stdio.h>
#include <math.h>

double greater_root(double a, double b, double c) {
	double larger_root;
	//int real;
	//int imag;
	double determinant = (b*b) - (4*a*c);
	if (determinant >= 0) {
		double root1 = ((-b) + sqrt(determinant))/(2*a);
		double root2 = ((-b) - sqrt(determinant))/(2*a);
		//printf("%s%d%s%d\n", "root1: " , root1, " root2: ", root2 );
		if (root1>root2) {
			larger_root = root2;
		} else {
			larger_root = root2;
		}
		//printf("%s%d\n", "The larger root is: ", larger_root);
		//return larger_root;
	}/* else {
		real = (-b)/(2*a);
		imag = sqrt(-determinant)/(2*a);
		printf("The roots are complex: %d+%di and %d-%di", real,imag, real, imag);
	}*/
	return larger_root;
}