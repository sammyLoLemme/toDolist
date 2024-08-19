// npm install express mongoose ejs dotenv
// npm install --save-dev nodemon


// Declare Variables
const express = require("express")
const app = express()
const PORT = 8000;
const mongoose = require("mongoose")
const TodoTask = require('./models/todotask')
require('dotenv').config()

// set middleware
app.set("view engine", "ejs")
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))


mongoose.connect(process.env.DB_CONNECTION)
    // {useNewUrlParser: true})
     .then(() => console.log('Connected to db!'))
.catch((err) => {console.error(err);});



// GET METHOD
app.get('/', async (request, response) => {
    try {
        const tasks = await TodoTask.find({})
        response.render("index.ejs", { todoTasks: tasks })
      
        
    } catch (error) {
        response.status(500).send({message: error.message})    }
});

// Post
app.post('/', async (req,res) => {
    const todoTask = new TodoTask(
        {
            title: req.body.title,
            content: req.body.content
        }
    )
    try {
        await todoTask.save()
        console.log(todoTask)
        res.redirect("/")
    } catch(err){
        if (err) return res.status(500).send(err)
        res.redirect('/')
    }
})

// EDIT or Update method
// app
//     .route("/edit/:id")
//     .get((req, res) => {
//         const id = req.params.id;
//         TodoTask.find({}, (err, tasks) => {
//             res.render("edit.ejs", { todoTasks: tasks, idTask: id });
//         });
//     })
   
app
     .route("/edit/:id")
     .get(async (req, res) => {
         const id = req.params.id;
         const tasks = await TodoTask.find({});
         res.render("edit.ejs", { todoTasks: tasks, idTask: id });
    })


        
    // .post((req,res) => {
    //     const id =  req.params.id
    //     TodoTask.findByIdAndUpdate(
    //         id,
    //         {
    //             title: req.body.title,
    //             content: req.body.content
    //         },
    //         err => {
    //             if (err) return res.status(500).send(err)
    //                 res.redirect('/')
    //         }
    //     )
    // })
    .post(async (req, res) => {
        const id = req.params.id;
        try {
            await TodoTask.findByIdAndUpdate(
                id,
                {
                    title: req.body.title,
                    content: req.body.content
                }
            );
            res.redirect('/');
        } catch (err) {
            res.status(500).send(err);
        }
    });


// DELETE
app
   .route("/remove/:id")
   .get(async (req,res) => {
    const id = req.params.id

     try {
        await TodoTask.findByIdAndDelete(id);
        res.redirect('/');
     } catch (err) {
        res.status(500).send(err);
     }
   })



 app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))


