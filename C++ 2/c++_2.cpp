#include <iostream>
#include <string>
#include <vector>

// Function declaration (takes two parameters)
void displayDetails(const std::string& name, int age);

int main() {
    // 1. Modify and manipulate multiple variables
    int age = 20; // Integer variable
    std::string name = "Alex"; // String variable

    std::cout << "Initial Name: " << name << ", Age: " << age << std::endl;
    age += 5; // Modify integer variable
    name = "Chris"; // Modify string variable
    std::cout << "Updated Name: " << name << ", Age: " << age << std::endl;

    // 2. Create nested decision structures
    if (age > 18) {
        if (age < 30) {
            std::cout << name << " is in their twenties." << std::endl;
        } else {
            std::cout << name << " is 30 or older." << std::endl;
        }
    } else {
        std::cout << name << " is under 18." << std::endl;
    }

    // 3. Implement nested loops
    std::cout << "\nNested Loop Output:" << std::endl;
    for (int i = 1; i <= 3; ++i) {
        for (int j = 1; j <= 2; ++j) {
            std::cout << "Outer loop " << i << ", Inner loop " << j << std::endl;
        }
    }

    // 4. Create and call custom functions with parameters
    displayDetails(name, age);

    // 5. Use arrays or lists for operations
    std::vector<int> numbers = {10, 20, 30, 40, 50}; // Array-like structure
    numbers[2] = 100; // Modify an element
    std::cout << "\nModified Array Elements:" << std::endl;
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    // Add an element to the vector (dynamic array)
    numbers.push_back(60);
    std::cout << "Array after adding an element: ";
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    return 0;
}

// 6. Optimize and document your code
// Function definition
// This function prints the details of a person (name and age)
// Parameters:
//   name: The name of the person (string)
//   age: The age of the person (integer)
void displayDetails(const std::string& name, int age) {
    std::cout << "\nDetails from the function:" << std::endl;
    std::cout << "Name: " << name << ", Age: " << age << std::endl;
}
