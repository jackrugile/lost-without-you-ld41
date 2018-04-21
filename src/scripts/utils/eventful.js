class Eventful {

  /*
  ------------------------------------------
  | constructor:void
  |
  | Construct.
  ------------------------------------------ */
  constructor() {
    this._events = [];
  }

  /*
  ------------------------------------------
  | validateEventType:null
  |
  | type:string - event name
  |
  | Validate event type.
  ------------------------------------------ */
  validateEventType(type) {
    if((/^[a-z\-_]+$/g).test(type) === false) {
      throw 'Error: type type must be a string (a-z, -, _)!';
    }
  }

  /*
  ------------------------------------------
  | validateEventCallback:null
  |
  | cb:function - callback
  |
  | Validate event callback.
  ------------------------------------------ */
  validateEventCallback(cb) {
    if(typeof(cb) !== 'function') {
      throw 'Error: callback must be a function!';
    }
  }

  /*
  ------------------------------------------
  | eventTypeExists:boolean
  |
  | type:string - event name
  |
  | Does this event type exist.
  ------------------------------------------ */
  eventTypeExists(type) {
    return this._events.hasOwnProperty(type);
  }

  /*
  ------------------------------------------
  | on:object
  |
  | type:string - event name
  | cb:function - callback
  |
  | Register an event.
  ------------------------------------------ */
  on(type, cb) {
    // check type / cb
    this.validateEventType(type);
    this.validateEventCallback(cb);

    // add type if it doesn't exist
    if(this.eventTypeExists(type) === false) {
      this._events[type] = [];
    }

    // register event
    this._events[type].unshift(cb);

    // return this for chainging
    return this;
  }

  /*
  ------------------------------------------
  | off:object
  |
  | type:string - event name
  | ...args[0]:function - callback
  |
  | Remove an event.
  ------------------------------------------ */
  off(type, ...args) {
    let index;

    // check type
    this.validateEventType(type);

    // are there any events with this type?
    if(this.eventTypeExists(type) === false) {
      return this;
    }

    // if no cb was specfied, remove them all
    if(args.length === 0) {
      this._events[type] = [];
      return this;
    }

    // check args
    this.validateEventCallback(args[0]);

    // are there any listeners?
    index = this._events[type].indexOf(args[0]);
    if(index !== -1) {
      setTimeout(() => {
        this._events[type].splice(index, 1);
      }, 0);
    }

    // return this for chainging
    return this;
  }

  /*
  ------------------------------------------
  | trigger:object
  |
  | type:string - event name
  | data:array - data to callback
  |
  | Trigger an event.
  ------------------------------------------ */
  trigger(type, data = {}) {
    // check type / data
    this.validateEventType(type);

    if(typeof(data) !== 'object') {
      throw 'Error: data must be an object!';
    }

    // are there any listeners?
    if(this.eventTypeExists(type) === false) {
      return this;
    }

    // pass type to callbacks
    data.ev_type = type;

    // execute callbacks
    this._events[type].forEach((cb) => {
      cb.call(this, data);
    });

    // return this for chainging
    return this;
  }
}

module.exports = Eventful;
