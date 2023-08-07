//this the solution for the problem three sum

/*
complexity
time: O(n^2)
space: O(1)
*/

#include<bits/stdc++.h>
using namespace std;

int main()
{
    int n;
    //minimum 3 elements should be present
    cin>>n;
    vector<int> array(n);
    for(int i=0;i<n;i++){
        cin>>array[i];
    }
    int k;
    cin>>k;
    sort(array.begin(),array.end());
    for(auto i:array){
        cout<<i<<" ";
    }
    cout<<endl;
    int p1,p2;
    for(int i=0;i<(n-2);i++){
        p1=i+1;
        p2=n-1;
        while(p1<p2){
            if((k-array[i])==(array[p1]+array[p2])){
                cout<<"yes"<<endl;
                return 0;
            }
            if((k-array[i])>(array[p1]+array[p2])) p1++;
            if((k-array[i])<(array[p1]+array[p2])) p2--;
        }
        if(p2==(i+1)){
            cout<<"no"<<endl;
            return 0;
        }
    }
    return 0;
}