#include <iostream>
#include <cstdlib>
#include <fstream>
#include <dirent.h>
#include <sstream>
#include <map>
#include <vector>
#include <string>
#include <algorithm>
#include <sstream>
using namespace std;


int main(int argc, char * client_files_paths[]) {
	system("g++ -std=c++0x program_repair.cpp -o pr");
	system("./pr > suggested_fix.txt");
}
