const notes = [
    { title: "Learn JS", category: "work" },
    { title: "Read Book", category: "personal" },
    { title: "Build App", category: "work" },
    { title: "New Idea", category: "ideas" }
];
const result = notes.reduce(function(count,note){
    if(note.category === "work"){
        count.work++;
        return count
    }
    else if(note.category === "personal"){
        count.personal++;
        return count
    }
    else if(note.category === "ideas"){
        count.ideas++;
        return count
    }
},{
    work:0,
    personal:0,
    ideas : 0
});
console.log(result)