function Alert(props) {
    return (
       <div style={{height:'60px'}}>
        {
          props.alert&&<div>
          <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
          <strong>{props.alert.message}</strong> 
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        </div>
        }
       </div>
    )
  }
  
  export default Alert