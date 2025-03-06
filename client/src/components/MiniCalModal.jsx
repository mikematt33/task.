import React, { useState, useEffect, useRef } from 'react';
import Datepicker from 'react-datepicker';
import {Button, Dropdown, Form, FormLabel, FormControl} from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {FaCalendarAlt} from 'react-icons/fa';
import ErrorModal from "./ErrorModal";

const InputDate = React.forwardRef(({ value, onClick }, ref) => {
    return (
        <div className="input-date" onClick={onClick}>
            <input type="text" className='form-control' value={value} readOnly />
            <div className="append">
              <span className="icon">
                <FaCalendarAlt />
              </span>
              </div>
        </div>
    );
});

function MiniCalModal({ handleCloseModal, savedDate, disable, classInput }) {
    const [taskSelectedDate, setTaskSelectedDate] = useState(null);
    const [eventSelectedDate, setEventSelectedDate] = useState(null);
    const [startTime,setStartTime] = useState({hour: "", minute: "", period: "AM"});
    const [eventStartTime, setEventStartTime] = useState({hour: "", minute: "", period: "AM"}); 
    const [endTime, setEndTime] = useState({ hour: '', minute: '', period: 'AM' });
    const [repeat, setRepeat] = useState("None");
    const [repeatEvent, setRepeatEvent] = useState("None");
    const [repeatTime, setRepeatTime] = useState("None");
    const [repeatTimeTask, setRepeatTimeTask] = useState("None");
    const [activeForm, setActiveForm] = useState("Task");
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [currentErrorMessage, setCurrentErrorMessage] = useState("Error ...");

    useEffect(() => {
      if (savedDate !== null) {
        if (savedDate.type === "Task") {
            setTaskSelectedDate(savedDate.taskSelectedDate);
            setStartTime(savedDate.startTime);
            setRepeat(savedDate.repeat);
            setRepeatTimeTask(savedDate.repeatTimeTask);
            setActiveForm("Task");
        } else {
            setEventSelectedDate(savedDate.eventSelectedDate);
            setEventStartTime(savedDate.eventStartTime);
            setEndTime(savedDate.endTime);
            setRepeatEvent(savedDate.repeatEvent);
            setRepeatTime(savedDate.repeatTime);
            setActiveForm("Event");
        }
      }
    }, [savedDate]);

    useEffect(() => {
      if (disable === null) {
        disable = false;
        }
    }, [disable]);

    const handleDateChange = (date) => {
      if (activeForm === "Task") {
          setTaskSelectedDate(date);
      } else {
          setEventSelectedDate(date);
      }
  };

    const handleTimeChange = (e, field, isStart) => {
      const value = e.target.value;
      if (activeForm === "Task") { 
          setStartTime(prevState => ({ ...prevState, [field]: value }));
      } else if (activeForm === "Event") { 
          if (isStart) {
              setEventStartTime(prevState => ({ ...prevState, [field]: value }));
          } else {
              setEndTime(prevState => ({ ...prevState, [field]: value }));
          }
      }
  };

  const toggleSelection = (period, isStart) => {
    if (activeForm === "Task") { 
        setStartTime(prevState => ({ ...prevState, period: period }));
    } else if (activeForm === "Event") { 
        if (isStart) {
            setEventStartTime(prevState => ({ ...prevState, period: period }));
        } else {
            setEndTime(prevState => ({ ...prevState, period: period }));
        }
    }
  };

    const saveAndClose = (event) => {
      event.preventDefault();

      if (classInput === 'modalCalendar-content-create') {
        if (activeForm === "Task") {
          if (!taskSelectedDate || !startTime.hour || !startTime.minute) {
              handleShowErrorModal('Task form is incomplete.');
              console.log("Task form is incomplete.");
              return; 
          }
        } else if (activeForm === "Event") {
            if (!eventSelectedDate || !eventStartTime.hour || !eventStartTime.minute || !endTime.hour || !endTime.minute) {
                handleShowErrorModal('Event form is incomplete.');
                console.log("Event form is incomplete.");
                return; 
            }
        }
      }

      let formData = {};
      if (activeForm === "Task") {
        formData = {
          type: "Task",
          taskSelectedDate,
          startTime,
          repeat,
          repeatTimeTask,
        };
      } else {
        formData = {
          type: "Event",
          eventSelectedDate,
          eventStartTime,
          endTime,
          repeatEvent,
          repeatTime,
        };
      }
      
      handleClear();

      handleCloseModal(formData, 'task');
    };

    const closeWithX = (event) => {
      event.preventDefault();

      let formData = {};

      if (taskSelectedDate === null && eventSelectedDate === null) {
        handleCloseModal(null, 'x');
        return;
      }

    if (activeForm === "Task") {
      formData = {
        type: "Task",
        taskSelectedDate,
        startTime,
        repeat,
        repeatTimeTask,
      };
    } else {
      formData = {
        type: "Event",
        eventSelectedDate,
        eventStartTime,
        endTime,
        repeatEvent,
        repeatTime,
      };
    }

      if (classInput === 'modalCalendar-content-create') {
        if (activeForm === "Task") {
          if (!taskSelectedDate || !startTime.hour || !startTime.minute) {
              handleShowErrorModal('Task form is incomplete.');
              console.log("Task form is incomplete.");
              return; 
          }
        } else if (activeForm === "Event") {
            if (!eventSelectedDate || !eventStartTime.hour || !eventStartTime.minute || !endTime.hour || !endTime.minute) {
                handleShowErrorModal('Event form is incomplete.');
                console.log("Event form is incomplete.");
                return; 
            }
        }
      }

      handleCloseModal(formData, 'x');
    };

    const handleShowErrorModal = (message) => {
      setCurrentErrorMessage(message)
      setShowErrorModal(true);
    };
  
    const handleCloseErrorModal = () => {
      setShowErrorModal(false);
      setCurrentErrorMessage('');
    };

    const handleClear = () => {
      setTaskSelectedDate(null);
      setEventSelectedDate(null);
      setStartTime({hour: "", minute: "", period: "AM"});
      setEventStartTime({hour: "", minute: "", period: "AM"});
      setEndTime({hour: "", minute: "", period: "AM"});
      setRepeat("None");
      setRepeatEvent("None");
      setRepeatTime("None");
      setRepeatTimeTask("None");
    };

    const formRender = () => {
      if (activeForm === "Task") {
        return (
          <div>
            <Datepicker selected={taskSelectedDate} onChange={handleDateChange} customInput={<InputDate />} calendarClassName="background__calendar" inline/>
          <div className="modalTime" style={{marginBottom: '80px'}}>
            <div className="modalTime-side">
            <FormLabel className="ModalTime-front">Time</FormLabel>
            </div>
          <div className="modalTimeInput-hour">
          <FormLabel className="modalTime-hour">Hr</FormLabel>
          <FormControl type="number-hours" className="formInput-hour" value={startTime.hour} onChange={(e) => handleTimeChange(e, "hour", true)} placeholder=""/>
          </div>
          <div className="modalTimeInput-min">
              <FormLabel className="modalTime-label">Min</FormLabel>
            <FormControl type="number-min" className="formInput-min" value={startTime.minute !== '' && startTime.minute === 0 ? startTime.minute.toString().padStart(2, '0') : startTime.minute} onChange={(e) => handleTimeChange(e, "minute", true)} placeholder=""/>
            </div>
            <div className="ampm-toggle">
              <Button className={`toggle-button ${startTime.period === 'AM' ? 'active' : ''}`}
                onClick={() => toggleSelection("AM", true)}> AM </Button>
              <Button className={`toggle-button ${startTime.period === 'PM' ? 'active' : ''}`}
                onClick={() => toggleSelection("PM", true)}> PM </Button>
            </div>
          </div>
          <div className="modalRepeatTime-Toggle">
            <div className="modalRepeatTask-Toggle">
              <FormLabel className="modalRepeatTask-label">Repeat</FormLabel>
              <Dropdown>
                <Dropdown.Toggle disabled={disable} variant="success" id="dropdown-basic" className="modalRepeatTask-period">{repeat || "None"}</Dropdown.Toggle>
                <Dropdown.Menu>
                <Dropdown.Item onClick={() => setRepeat("None")}>None</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRepeat("Daily")}>Daily</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRepeat("Weekly")}>Weekly</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRepeat("Bi-Weekly")}>Bi-Weekly</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRepeat("Monthly")}>Monthly</Dropdown.Item>
                  </Dropdown.Menu>
                  </Dropdown>
            </div>
            <div className="modalRepeatTimeTask-Toggle">
            <FormLabel className="modalRepeatTime-label">For</FormLabel>
              <Dropdown>
                <Dropdown.Toggle disabled={disable} variant="success" id="dropdown-basic" className="modalRepeatTime-period"> {repeatTimeTask || "None"} </Dropdown.Toggle>
                <Dropdown.Menu>
                <Dropdown.Item onClick={() => setRepeatTimeTask("None")}>None</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRepeatTimeTask("1 Week")}>1 Week</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRepeatTimeTask("2 Weeks")}>2 Weeks</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRepeatTimeTask("1 Month")}>1 Month</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRepeatTimeTask("3 Months")}>3 Months</Dropdown.Item>
                  </Dropdown.Menu>
                  </Dropdown>
            </div>
       </div>
    </div>
      );
    } else {
        return (
          <div>
             <Datepicker selected={eventSelectedDate} onChange={handleDateChange} customInput={<InputDate />} calendarClassName="background__calendar" inline/>
          <div className="modalTime">
            <div className="modalTime-side">
            <FormLabel className="timeStart-front">Start</FormLabel>
            </div>
          <div className="modalTimeInput-hour">
          <FormLabel className="modalTime-hour">Hr</FormLabel>
          <FormControl type="number-hours" className="formInput-hour" value={eventStartTime.hour} onChange={(e) => handleTimeChange(e, "hour", true)} placeholder=""/>
          </div>
          <div className="modalTimeInput-min">
              <FormLabel className="modalTime-label">Min</FormLabel>
              <FormControl type="number-min"  className="formInput-min" value={eventStartTime.minute} onChange={(e) => handleTimeChange(e, "minute", true)} placeholder=""/>
            </div>
            <div className="ampm-toggle">
              <Button className={`toggle-button ${eventStartTime.period === 'AM' ? 'active' : ''}`}
                onClick={() => toggleSelection("AM", true)}> AM </Button>
              <Button className={`toggle-button ${eventStartTime.period === 'PM' ? 'active' : ''}`}
                onClick={() => toggleSelection("PM", true)}> PM </Button>
            </div>
          </div>
          <div className="timeEnd">
          <div className="tEnd-front">
          <FormLabel className="timeEnd-front">End</FormLabel>
          </div>
        <div className="timeEndInput-hour">
        <FormLabel className="timeEnd-hour">Hr</FormLabel>
        <FormControl type="end-number-hours" className="formEndInput-hour" value={endTime.hour} onChange={(e) => handleTimeChange(e, "hour", false)} placeholder=""/>
        </div>
        <div className="timeEndInput-min">
            <FormLabel className="timeEnd-min">Min</FormLabel>
          <FormControl type="end-number-min" className="formEndInput-min" value={endTime.minute} onChange={(e) => handleTimeChange(e, "minute", false)} placeholder=""/>
          </div>
          <div className="ampm-toggle">
            <Button className={`toggle-button ${endTime.period === 'AM' ? 'active' : ''}`}
              onClick={() => toggleSelection("AM", false)}> AM </Button>
            <Button className={`toggle-button ${endTime.period === 'PM' ? 'active' : ''}`}
              onClick={() => toggleSelection("PM", false)}> PM </Button>
          </div>
        </div>
        <div className="modalRepeatsContainer">
        <div className="modalRepeatEvent-Toggle">
          <FormLabel className="modalRepeatEvent-label">Repeat</FormLabel>
              <Dropdown>
                <Dropdown.Toggle disabled={disable} variant="success" id="dropdown-basic" className="modalRepeatTask-period"> {repeatEvent} </Dropdown.Toggle>
                <Dropdown.Menu>
                <Dropdown.Item onClick={() => setRepeatEvent("None")}>None</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRepeatEvent("Daily")}>Daily</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRepeatEvent("Weekly")}>Weekly</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRepeatEvent("Bi-Weekly")}>Bi-Weekly</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRepeatEvent("Monthly")}>Monthly</Dropdown.Item>
                  </Dropdown.Menu>
                  </Dropdown>
            </div>
            <div className="modalRepeatTime-Toggle">
          <FormLabel className="modalRepeatTime-label">For</FormLabel>
              <Dropdown>
                <Dropdown.Toggle disabled={disable} variant="success" id="dropdown-basic" className="modalRepeatTime-period"> {repeatTime} </Dropdown.Toggle>
                <Dropdown.Menu>
                <Dropdown.Item onClick={() => setRepeatTime("None")}>None</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRepeatTime("1 Week")}>1 Week</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRepeatTime("2 Weeks")}>2 Weeks</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRepeatTime("1 Month")}>1 Month</Dropdown.Item>
                  <Dropdown.Item onClick={() => setRepeatTime("3 Months")}>3 Months</Dropdown.Item>
                  </Dropdown.Menu>
                  </Dropdown>
            </div>
       </div>
      </div>
     );
    }
  };
  
    return (
        <div className="modalCalendar">
          <div className={classInput}>
            <span className="modalCalendar-close" onClick={closeWithX}>&times;</span>
            <Form onSubmit={saveAndClose}>
            <div className="modalToggle-container"> 
              <Button className={`toggle-button ${activeForm === "Task" ? "active" : ""}`} onClick={() => setActiveForm("Task")}> Task </Button>
              <Button className={`toggle-button ${activeForm === "Event" ? "active" : ""}`} onClick={() => setActiveForm("Event")}> Event </Button>
              </div>
              {formRender()}
              <div className="button-choice">
                <Button className="clear-button" onClick={handleClear}>Clear</Button>
                <Button type='submit' className="done-button">Done</Button>
              </div>
            </Form>
          </div>
          {showErrorModal && (
            <ErrorModal
              show={showErrorModal}
              errorMessage={currentErrorMessage}
              handleClose={handleCloseErrorModal}
            ></ErrorModal>
          )}
        </div>
  );
}

  
  export default MiniCalModal;