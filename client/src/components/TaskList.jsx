import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import MiniCalModal from "./MiniCalModal";
import TagModal from "./TagModal";
import { fetchUserEventsByID, createTask, createEvent } from "../actions";
import { jwtDecode } from "jwt-decode"; // Corrected import for jwtDecode
import ErrorModal from "./ErrorModal";

import Task from "./Task";

function TaskList({ onSelectTask, selectedTagEvents }) {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCalModal, setShowCalModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [currentTags, setCurrentTags] = useState([]);
  const [currentDate, setCurrentDate] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [currentErrorMessage, setCurrentErrorMessage] = useState("Error ...");

  const toggleGroup = (baseId) => {
    setExpandedGroups((prev) => ({ ...prev, [baseId]: !prev[baseId] }));
  };

  const handleOpenCalModal = () => {
    setShowCalModal(true);
  };

  const handleCloseCalModal = (calendarElements) => {
    setCurrentDate(calendarElements);
    setShowCalModal(false);
  };

  const handleOpenTagModal = () => {
    setShowTagModal(true);
  };

  const handleCloseTagModal = (tags) => {
    setCurrentTags(tags);
    setShowTagModal(false);
  };

  const handleShowErrorModal = (message) => {
    setCurrentErrorMessage(message)
    setShowErrorModal(true);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setCurrentErrorMessage('');
  };

  const handleCreateTask = async () => {
      const taskNameElement = document.getElementById('CreateTaskName');
      const taskName = taskNameElement.value;
      const taskTags = currentTags;
      const taskDate = currentDate;

      if (!taskName) {
        handleShowErrorModal('Task name cannot be empty');
        console.error('Task name cannot be empty');
        return;
      }

      if (taskTags.length === 0) {
          handleShowErrorModal('Task tags cannot be empty');
          console.error('Task tags cannot be empty');
          return;
      }

      if (taskDate === null) {
          handleShowErrorModal('Task date cannot be empty');
          console.error('Task date cannot be empty');
          return;
      }

      let taskJson = {};
      const token = localStorage.getItem('token');
      const userId = jwtDecode(token).id;
      try {
          if (taskDate.type === 'Task') {
              let date = new Date(taskDate.taskSelectedDate);
              let year = date.getUTCFullYear();
              let month = date.getUTCMonth(); 
              let day = date.getUTCDate();

              let hour = parseInt(taskDate.startTime.hour);
              let minute = parseInt(taskDate.startTime.minute);
              let period = taskDate.startTime.period;

              // Convert to 24-hour format
              if (period === 'PM' && hour < 12) {
                  hour += 12;
              } else if (period === 'AM' && hour === 12) {
                  hour = 0;
              }

              let startDateTime = new Date(Date.UTC(year, month, day, hour, minute));

              taskJson = {
                  user_id: userId,
                  title: taskName,
                  tags: taskTags,
                  end: startDateTime.toISOString(),
                  repeating: taskDate.repeat,
                  repeating_end_time: taskDate.repeatTimeTask,
              };

              try {
                  const response = await createTask(taskJson);
              } catch (error) {
                  console.error(error);
              }
          } else {
              let date = new Date(taskDate.eventSelectedDate);
              let year = date.getUTCFullYear();
              let month = date.getUTCMonth(); 
              let day = date.getUTCDate();

              let startHour = parseInt(taskDate.eventStartTime.hour);
              let startMinute = parseInt(taskDate.eventStartTime.minute);
              let startPeriod = taskDate.eventStartTime.period;

              // Convert to 24-hour format
              if (startPeriod === 'PM' && startHour < 12) {
                  startHour += 12;
              } else if (startPeriod === 'AM' && startHour === 12) {
                  startHour = 0;
              }

              let endHour = parseInt(taskDate.endTime.hour);
              let endMinute = parseInt(taskDate.endTime.minute);
              let endPeriod = taskDate.endTime.period;

              // Convert to 24-hour format
              if (endPeriod === 'PM' && endHour < 12) {
                  endHour += 12;
              } else if (endPeriod === 'AM' && endHour === 12) {
                  endHour = 0;
              }

              let startTimeDate = new Date(Date.UTC(year, month, day, startHour, startMinute));
              let endTimeDate = new Date(Date.UTC(year, month, day, endHour, endMinute));

              let eventJson = {
                  user_id: userId,
                  title: taskName,
                  tags: taskTags,
                  start: startTimeDate.toISOString(),
                  end: endTimeDate.toISOString(),
                  repeating: taskDate.repeatEvent,
                  repeating_end_time: taskDate.repeatTime,
              };

              try {
                  const response = await createEvent(eventJson);
              } catch (error) {
                  console.error(error);
              }
          }
      } catch (error) {
          console.error(error);
          return;
      }

      setCurrentTags([]);
      setCurrentDate(null);
      taskNameElement.value = '';

      window.location.reload();
  };

  const getBaseTaskId = (taskId) => {
    const parts = taskId.split("-");
    if (parts.length > 1) {
      parts.pop();
    }
    return parts.join("-");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const { id: currentUserId } = jwtDecode(token);
      
      fetchUserEventsByID(currentUserId)
        .then((fetchedTasks) => {
          // Extract UIDs from selectedTagEvents
          const tagEventUIDs = selectedTagEvents.map((event) => event.uid);
          // Filter fetched tasks by checking if their UID is in tagEventUIDs
          const filteredAndSortedTasks = fetchedTasks
            .filter((task) => tagEventUIDs.includes(task.uid))
            .sort((a, b) => new Date(a.end) - new Date(b.end));

          const groupedTasks = new Map();

          filteredAndSortedTasks.forEach((task) => {
            const baseId = getBaseTaskId(task.uid);
            if (!groupedTasks.has(baseId)) {
              groupedTasks.set(baseId, [task]);
            } else {
              groupedTasks.get(baseId).push(task);
            }
          });
          setTasks(
            Array.from(groupedTasks, ([baseId, tasks]) => ({
              baseId,
              tasks,
              title: tasks[0].title,
              dueDate: formatDate(tasks[0].end),
            }))
          );
        })
        .catch((error) => console.error("Error fetching tasks:", error));
    }
  }, [selectedTagEvents]); // React to changes in selectedTagEvents

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTaskGroups = tasks.filter((taskGroup) =>
    taskGroup.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isRepeatingTask = (taskId) => {
    const regex = /-\d+$/;
    return regex.test(taskId);
  };

  const formatDate = (dateString) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    const timeDifference = dueDate - now;
    const hoursLeft = timeDifference / (1000 * 60 * 60);
    const daysLeft = Math.ceil(hoursLeft / 24);
    let formattedDisplay = "";

    if (timeDifference < 0) {
      formattedDisplay = `Overdue! Was due on ${dueDate.toLocaleDateString(
        "en-US",
        { month: "long", day: "numeric" }
      )} at ${dueDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`;
    } else {
      formattedDisplay = dueDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      if (dueDate.toDateString() === now.toDateString()) {
        formattedDisplay = `Due: Today, ${formattedDisplay}`;
        if (hoursLeft > 0) {
          formattedDisplay += ` - ${Math.ceil(hoursLeft)}hrs left`;
        } else {
          formattedDisplay += " - Time's up!";
        }
      } else {
        formattedDisplay = `Due: ${dueDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        })}, ${formattedDisplay}`;
        if (daysLeft > 1) {
          formattedDisplay += ` - ${daysLeft} days left`;
        } else {
          formattedDisplay += ` - ${Math.ceil(hoursLeft)}hrs left`;
        }
      }
    }
    return { raw: dueDate.toISOString(), display: formattedDisplay };
  };

  return (
    <Container fluid>
      <Row className="justify-content-md-center">
        <Form.Control
          id="TaskSearch"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Row>
      <Row className="justify-content-md-center">
        <InputGroup id="CreateTaskGroup">
          <Form.Control
            className="align-middle"
            id="CreateTaskName"
            placeholder="Add Task"
          />
          <Button
            variant="outline-secondary"
            className={
              currentDate !== null
                ? "CreateTaskButtonComplete"
                : "CreateTaskButton"
            }
            onClick={handleOpenCalModal}
          >
            <i className="bi bi-calendar-plus"></i>
          </Button>
          <Button
            variant="outline-secondary"
            className={
              currentTags.length > 0
                ? "CreateTaskButtonComplete"
                : "CreateTaskButton"
            }
            onClick={handleOpenTagModal}
          >
            <i className="bi bi-tags"></i>
          </Button>
          <Button
            variant="outline-secondary"
            className="CreateTaskButton"
            onClick={handleCreateTask}
          >
            <i className="bi bi-send-plus-fill"></i>
          </Button>
        </InputGroup>
      </Row>
      {showCalModal && (
        <MiniCalModal
          handleCloseModal={handleCloseCalModal}
          savedDate={currentDate}
          classInput={"modalCalendar-content-create"}
        />
      )}
      {showTagModal && (
        <TagModal
          show={showTagModal}
          handleClose={handleCloseTagModal}
          savedTags={currentTags}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          show={showErrorModal}
          errorMessage={currentErrorMessage}
          handleClose={handleCloseErrorModal}
        ></ErrorModal>
      )}

      {filteredTaskGroups.map((taskGroup) => {
        const nonRepeatingTasks = taskGroup.tasks.filter(
          (task) => !isRepeatingTask(task.uid)
        );
        return (
          nonRepeatingTasks.length > 0 && (
            <div key={taskGroup.baseId} className="task-group-non-repeating">
              {nonRepeatingTasks.map((task) => (
                <Task
                  key={task.uid}
                  uid={task.uid}
                  name={task.title}
                  dueDate={formatDate(task.end)}
                  onSelectTask={onSelectTask}
                />
              ))}
            </div>
          )
        );
      })}

      {filteredTaskGroups.map((taskGroup) => {
        const repeatingTasks = taskGroup.tasks.filter((task) =>
          isRepeatingTask(task.uid)
        );
        return (
          repeatingTasks.length > 0 && (
            <div key={taskGroup.baseId} className="task-group-repeating" style={{marginTop: '15px'}}>
              <div
                className="task-group-header"
                onClick={() => toggleGroup(taskGroup.baseId)}
              >
                <h4>
                  <span className="dropdown-icon">
                    {expandedGroups[taskGroup.baseId] ? (
                      <img
                        className="dropdownImage"
                        src="/images/Dropdown.svg"
                        alt="dropdown"
                      /> // Image for expanded state
                    ) : (
                      <img
                        className="dropdownImage"
                        src="/images/Dropdown-closed.svg"
                        alt="dropdown"
                      />
                    )}
                    {taskGroup.title}
                  </span>
                </h4>
              </div>

              {expandedGroups[taskGroup.baseId] && (
                <div className="task-group-dropdown">
                  {repeatingTasks.map((task) => (
                    <Task
                      key={task.uid}
                      uid={task.uid}
                      name={task.title}
                      dueDate={formatDate(task.end)}
                      onSelectTask={onSelectTask}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        );
      })}
    </Container>
  );
}

export default TaskList;
