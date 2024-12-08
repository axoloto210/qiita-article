

const foo = {}

for(let i=0; i<3; i++){
    foo[i] = i;
}

foo.length = 3;

const bar = Array.prototype.filter.call(foo, (fooProperty)=>fooProperty >= 1)

console.log(bar)



const fooArray = Array.from(foo)

console.log(fooArray)



const nodeList = document.querySelectorAll('.foo')

const nodeListArray = Array.prototype.map.call(nodeList, (node)=>node)

console.log(nodeListArray)