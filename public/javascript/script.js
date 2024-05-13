const options = {
    transition: 'transition-opacity',
    duration: 1000,
    timing: 'ease-out',
  
    // callback functions
    onHide: (context, targetEl) => {
      console.log('element has been dismissed')
      console.log(targetEl)
    }
  };