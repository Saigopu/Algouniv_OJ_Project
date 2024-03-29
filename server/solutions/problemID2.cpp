// this is the solution which we will be using to get the expected output when user clicks run button

// this solution is for the problem find the element that appears once in an array where every other element appears twice

/*
complexity
time: O(n)
space: O(1)
*/

#include <bits/stdc++.h>
using namespace std;

int main()
{
    int n;
    cin >> n;
    // the array should be having only one element which is occuring once
    vector<int> array(n);
    for (int i = 0; i < n; i++)
    {
        cin >> array[i];
    }
    int answer = 0;
    for (int i = 0; i < 32; i++)
    {
        int temp = 0;
        for (int j = 0; j < n; j++)
        {
            temp += (array[j] & 1);
            array[j] = array[j] >> 1;
        }
        if (temp % 3)
            answer += (1 << i);
    }
    cout << answer << endl;
    return 0;
}