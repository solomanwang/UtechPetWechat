Page({
  data: {
    markers: [{
      iconPath: '../../../image/pet.png',
      id: 0,
      latitude: 29.817518,
      longitude: 106.523855,
      width: 30,
      height: 30
    }]
    
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})