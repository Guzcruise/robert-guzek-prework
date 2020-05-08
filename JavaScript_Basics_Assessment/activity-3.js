const nameList = ['Greg','Stacy','Kevin'];

let counter = 0;
while (nameList.length < 6) {
    const name = prompt('Name Please')
    nameList.push(name);
    counter++;

}
var i;
for (let i = 0; i < nameList.length; i++){
    console.log(nameList[i]);
  }

  nameList.length;