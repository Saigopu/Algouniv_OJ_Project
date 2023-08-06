//this is the solution which we will be using to get the expected output when user clicks run button

//this solution is for the problem TWO SUM

/*
complexity 
time: O(nlogn)
space: O(1)
*/

#include <bits/stdc++.h>
using namespace std;

int main()
{
    int n;
    cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++)
    {
        cin >> arr[i];
    }
    int k;
    cin >> k;
    sort(arr.begin(), arr.end());
    int p1 = 0, p2 = n - 1;
    while (p1 != p2)
    {
        if (arr[p1] + arr[p2] < k)
        {
            p1++;
        }
        else if (arr[p1] + arr[p2] > k)
        {
            p2--;
        }
        else
        {
            cout << "no" << endl;
            return 0;
        }
    }
    cout << "yes" << endl;
    return 0;
}