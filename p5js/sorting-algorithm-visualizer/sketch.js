var array = [];
var number;
var barWidth;
var gap;
var start;
var flag;
var sorter;
var printedArray;
var sorterDone;
var timer;
var algorithms = ["quick sort", "heap sort", "merge sort", "selection sort (slow!)", "insertion sort (slow!)"];
var sorters = [quickSortWrapper, heapSort, mergeSortWrapper, selectionSort, insertionSort];
var currentSorter = 0;
var algorithm;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255);
	barWidth = 1;
	gap = 0;
	number = floor(width/(barWidth+gap)-gap);
	array = [];
	for(let i = 0; i < number; i++)
		array[i] = random(0,1);
	let graphWidth = number*(barWidth+gap)-gap;
	start = floor((width-graphWidth)/2);
	flag = false;
	printedArray = false;
	algorithm = algorithms[currentSorter];
	textSize(25);
	strokeWeight(4)
}

function draw() {
	background(255);
	fill(0);
	noStroke();
	for(let i = 0; i < array.length; i++){
		rect(start+i*(barWidth+gap), height, barWidth, -array[i]*(height-1));
	}
	if(sorter){
		for(let i = 0; i < ceil(array.length/20); i++)
			sorterDone = sorter.next().done;
		
		if(sorterDone){
			sorter = undefined;
			//console.log(new Date().getTime() - timer);
			sorterDone = false;
		}
	}
	stroke(255);
	text("Algorithm: " + algorithm, 15, 50);
	noStroke();
}

function mousePressed() {
	sorter = sorters[currentSorter](array);
	if(flag){
		sorter = undefined;
		setup();
	}
	else{
		timer = new Date().getTime();
		flag = true;
	}
	redraw();
}

function* selectionSort(A){
	for(let i = 0; i < A.length; i++){
		let min = i;
		for(let j = i; j < A.length; j++){
			min = A[j] < A[min] ? j : min;
			yield;
		}
		swap(A,i,min);
	}
}

function* insertionSort(A){
	for(let i = 1; i < A.length; i++){
		let key = A[i];
		let j = i-1;
		while(j >= 0 && A[j] > key){
			A[j+1] = A[j];
			j--;
			yield;
		}
		A[j+1] = key;
	}
}

function mergeSortWrapper(A){
	return mergeSort(A, 0, A.length-1);
}

function* mergeSort(A, start, stop) {
	if(start < stop){
		let split = floor((start+stop)/2);
		var firstHalf = mergeSort(A, start, split);
		var secondHalf = mergeSort(A, split+1, stop);
		var merger = merge(A, start, split, stop);
		while(!firstHalf.next().done)
			yield;
		while(!secondHalf.next().done)
			yield;
		while(!merger.next().done)
			yield;
	}
	yield;
}

function* merge(A, start, split, stop){
	let L = A.slice(start, split+1);
	L[L.length] = 2;
	let R = A.slice(split+1, stop+1);
	R[R.length] = 2;
	let i = j = 0;
	for(let k = start; k <= stop; k++){
		if(L[i] <= R[j]){
			A[k] = L[i];
			i++;
		} else {
			A[k] = R[j];
			j++;
		}
		yield;
	}
	yield;
}

function quickSortWrapper(A){
	return quickSort(A, 0, A.length-1);
}

function* quickSort(A, start, stop) {
	if(start < stop){
		let pivot = A[stop];
		let partition = start-1;
		for(j = start; j < stop; j++){
			if(A[j] < pivot){
				partition++;
				swap(A, partition, j)
			}
			yield;
		}
		swap(A, partition+1, stop);
		yield;
		var left = quickSort(A, start, partition);
		var right = quickSort(A, partition+2, stop);
		while(!left.next().done){
			yield;
		}
		while(!right.next().done){
			yield;
		}
	}
}

function* heapSort(array){
	builder = buildMaxHeap(array);
	while(!builder.next().done)
		yield;
	for(let i = array.length-1; i >= 0; i--){
		swap(array, i, 0);
		let maxifier = maxHeapify(array, i, 0);
		while(!maxifier.next().done)
			yield;
	}
}

function checkHeap(heap, index){
	let right = 2*(index+1);
	let left = right-1;
	isHeap = true;
	if(right < heap.length){
		isHeap = (heap[right] <= heap[index] && checkHeap(heap, right))
	}
	if(left < heap.length && isHeap){
		isHeap = (heap[left] <= heap[index] && checkHeap(heap, left))
	}
	return isHeap;
}

function* buildMaxHeap(array){
	for(let i = floor(array.length/2); i >= 0; i--){
		let maxifier = maxHeapify(array, array.length, i);
		while(!maxifier.next().done)
			yield;
	}
}

function* maxHeapify(A, heapSize, index){
	let right = 2*(index+1);
	let left = right-1;
	let largest = index;
	if(left < heapSize && A[left] > A[largest])
		largest = left;
	if(right < heapSize && A[right] > A[largest])
		largest = right;
	if(largest != index){
		swap(array, index, largest);
		let maxifier = maxHeapify(A, heapSize, largest);
		while(!maxifier.next().done)
			yield;
	}
	yield;
}

function swap(A, i1, i2){
	if(A[i1] == undefined)
		throw new Error();
	let temp = A[i1];
	A[i1] = A[i2];
	A[i2] = temp;
}

function keyPressed(){
	switch(keyCode){
	case UP_ARROW:
		currentSorter--;
		break;
	case DOWN_ARROW:
		currentSorter++;
		break;
	}
	currentSorter = (currentSorter + algorithms.length)%algorithms.length;
	algorithm = algorithms[currentSorter];
}