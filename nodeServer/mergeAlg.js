class mergeSort {
    static merge(arr, l, m, r)
    {
        var n1 = m - l + 1;
        var n2 = r - m;
    
        // Create temp arrays
        var L = new Array(n1); 
        var R = new Array(n2);
    
        // Copy data to temp arrays L[] and R[]
        for (var i = 0; i < n1; i++)
            L[i] = arr[l + i];
        for (var j = 0; j < n2; j++)
            R[j] = arr[m + 1 + j];
    
        // Merge the temp arrays back into arr[l..r]
    
        // Initial index of first subarray
        var i = 0;
    
        // Initial index of second subarray
        var j = 0;
    
        // Initial index of merged subarray
        var k = l;
    
        while (i < n1 && j < n2) {
            if (L[i].stackSize >= R[j].stackSize) {
                arr[k] = L[i];
                i++;
            }
            else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }
    
        // Copy the remaining elements of
        // L[], if there are any
        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
        }
    
        // Copy the remaining elements of
        // R[], if there are any
        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
        }
    }
    
    // l is for left index and r is
    // right index of the sub-array
    // of arr to be sorted
    static mergeSort(arr,l, r){
        if(l>=r){
            return;
        }
        var m =l+ parseInt((r-l)/2);
        mergeSort.mergeSort(arr,l,m);
        mergeSort.mergeSort(arr,m+1,r);
        mergeSort.merge(arr,l,m,r);
    }
}

module.exports = mergeSort