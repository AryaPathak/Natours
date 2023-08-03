const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const { get } = require('http');

const app =express();

//Middlewears
app.use(morgan('dev'))
app.use(express.json());

app.use((req,res,next)=>{
    console.log('hello from middlewear');
    next();
})

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    next();
})


const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);


//RouteHandlers

const getAllTours = (req, res)=>{
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
}





const getTour = (req, res)=>{
    console.log(req.params);
    const id = req.params.id*1;

    const tour = tours.find(el=>el.id===id);
    // if(id>tours.lengh){
    if(!tour){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    
    res.status(200).json({
        status: 'success',
        
        data: {
            tour
        }
    })
}


const createTour = (req, res)=>{
    //console.log(req.body);
    const newId = tours[tours.length-1].id + 1;
    const newTour = Object.assign({id:newId}, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err=>{
        res.status(201).json({
            status: 'success',
            data:{
                tour: newTour
            }
        })
    }
    ); 
    
}

const updateTour = (req, res)=>{

    if(req.params.id*1>tours.length){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(200).json({
        status:'success',
        data:{
            tour:'<Update tour here...>'
        }
        
    })
}

const deleteTour = (req, res)=>{

    if(req.params.id*1>tours.length){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(204).json({
        status:'success',
        data:null
        
    })
}


const getAllUsers = (req, res)=>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    })
}


//All the data flow routs

// app.get('/api/v1/tours', getAllTours); 
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);


//Route

app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);


app
    .route('/api/v1/tours/:id')
    .get(updateTour)
    .delete(deleteTour);
   

app
    .route('./api/v1/users')
    .get(getAllUsers)
    .post(createUser);


app
    .route('./api/v1/users/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

//Start server

const port = 3000;
app.listen(port, ()=>{
    console.log(`App running on port ${port}...`);
})

