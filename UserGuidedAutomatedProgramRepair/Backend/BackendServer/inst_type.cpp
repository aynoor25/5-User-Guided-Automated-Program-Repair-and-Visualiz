#include <iostream>
#include <cstdlib>
#include <fstream>
#include <dirent.h>
#include <sstream>
#include <string>
#include <map>
#include <vector>
#include <algorithm>
#include <unistd.h>
#include <sys/types.h>
#include <signal.h>
#include <fcntl.h>
using namespace std;

// file only has one line
string read_file(string filename) {
  ifstream fix_file (filename);
  string line = "";
  if (fix_file.is_open()) {
    getline(fix_file, line);
  }
  return line;
}

int main() {
    system(("opt -load /home/llvm/Desktop/compliedllvm/lib/LLVMHello.so -inst_type < source_bitcode.bc > /dev/null")); 
    string fault_type = read_file("fix_type.txt");
    if (fault_type == "vr") {
      system(("opt -load /home/llvm/Desktop/compliedllvm/lib/LLVMHello.so -get_variables < source_bitcode.bc > /dev/null")); 
    }    
    return 0;
}

