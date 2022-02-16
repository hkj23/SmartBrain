import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
// import Clarifai from 'clarifai'
import Particles from 'react-tsparticles';
// import { Component } from 'react/cjs/react.production.min';


// const app = new Clarifai.App({
//   apiKey: '07357f32c88d40a99ff41de7d61f3f88'
//  });

const initialState = {
  input:'',
  imageUrl:'',
  box:{},
  route:'Signin',
  isSignedIn:false,
  user:{
    id:'',
    name: '',
    email: '',
    entries:0,
    joined: ''
}
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState;

  }
  loadUser = (data) =>{
  this.setState({user:{
    id:data.id,
    name: data.name,
    email: data.email,
    entries:data.entries,
    joined: data.joined
  }})  
  }
  
   displayFaceBox = (box) =>{
    this.setState({box:box});
    
  }
   calculateFaceLocation =(data)=>{
    
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height);
    return{
      leftCol: clarifaiFace.left_col*width,
      topRow: clarifaiFace.top_row*height,
      rightCol: width - (clarifaiFace.right_col*width),
      BottomRow: height - (clarifaiFace.bottom_row*height)
    }
  }
  

  
  onInputChange = (event) =>{
    this.setState({input:event.target.value});
  }
  onButtonSubmit = () =>{
    this.setState({imageUrl:this.state.input});
//     app.models
// .predict(
// Clarifai.FACE_DETECT_MODEL,

// this.state.input)
fetch('http://localhost:3001/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              input: this.state.input
            })
          })
          .then(response => response.json())
      .then(response => {
        console.log('hi', response)
        if (response) {
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
    // .then(response=>this.displayFaceBox(this.calculateFaceLocation(response)))
    //   .catch(err=>console.log(err));
    
  }
  onRouteChange = (route) =>{
    if(route==='signout'){
      this.setState(initialState);
    }
    else if(route==='home'){
      this.setState({isSignedIn:true});
    }
    this.setState({route:route});
  }
  render(){
    return (
      <div className="App">
        <Particles className='particles'
        id="tsparticles"
        
        options={{
          
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40,
              },
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outMode: "bounce",
              random: false,
              speed: 4,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 50,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              random: true,
              value: 5,
            },
          },
          detectRetina: true,
        }}
      />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        {this.state.route==='home'?
        <div>
        <Logo/>
        <Rank 
          name={this.state.user.name} 
          entries={this.state.user.entries}
        />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}
        />      
        <FaceRecognition 
          box ={this.state.box} 
          imageUrl={this.state.imageUrl}
        />
        </div>
        :(
          this.state.route==='Signin'?
          <Signin 
            loadUser={this.loadUser} 
            onRouteChange={this.onRouteChange}
          />:
          <Register 
            loadUser={this.loadUser} 
            onRouteChange={this.onRouteChange}
          />
        )
        
        
         }
      </div>
    );
  }
 
}

export default App;



