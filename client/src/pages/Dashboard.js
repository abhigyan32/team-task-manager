import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState("Medium");

  const [users, setUsers] =
  useState([]);

  const [assignedTo, setAssignedTo] =
  useState("");

  const [dueDate, setDueDate] =
    useState("");

  const userData =
    localStorage.getItem("user");

  const user = userData
    ? JSON.parse(userData)
    : null;

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");

      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
  try {
    const res = await API.get(
      "/auth/users"
    );

    console.log(res.data);

    setUsers(res.data);
  } catch (error) {
    console.log(error);
  }
  };

const createTask = async (e) => {
  e.preventDefault();

  try {
    if (!title || !description) {
      alert(
        "Please fill all required fields"
      );

      return;
    }

    const payload = {
      title,
      description,
      priority,
      dueDate,
    };

    if (assignedTo) {
      payload.assignedTo =
        assignedTo;
    }

    console.log(payload);

    const res = await API.post(
      "/tasks",
      payload
    );

    console.log(res.data);

    alert("Task Created");

    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setAssignedTo("");

    fetchTasks();
  } catch (error) {
    console.log(error);

    alert(
      error?.response?.data?.message ||
      "Task creation failed"
    );
  }
};

const updateTaskStatus = async (
  id,
  status
) => {
  try {
    await API.put(`/tasks/${id}`, {
      status,
    });

    fetchTasks();
  } catch (error) {
    console.log(error);
  }
};

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    window.location.href = "/";
  };

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">
          Team Task Dashboard
        </h1>

        <div className="d-flex align-items-center">
          <div
            className="me-3 text-end"
          >
            <h6 className="mb-0 fw-bold">
              {user?.name}
            </h6>

            <small className="text-muted">
              {user?.email}
            </small>

            <br />

            <span className="badge bg-dark mt-1">
              {user?.role}
            </span>
          </div>

          <div
            className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center fw-bold me-3"
            style={{
              width: "50px",
              height: "50px",
              fontSize: "18px",
            }}
          >
            {user?.name
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          <button
            onClick={logout}
            className="btn btn-dark"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center shadow p-3">
            <h3>Total Tasks</h3>

            <h2>{tasks.length}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow p-3">
            <h3>Pending</h3>

            <h2>{pendingTasks}</h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow p-3">
            <h3>Completed</h3>

            <h2>{completedTasks}</h2>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center">
            <h5 className="text-muted">
              High Priority
            </h5>

            <h2 className="text-danger">
              {
                tasks.filter(
                  (task) =>
                    task.priority === "High"
                ).length
              }
            </h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center">
            <h5 className="text-muted">
              Medium Priority
            </h5>

            <h2 className="text-warning">
              {
                tasks.filter(
                  (task) =>
                    task.priority ===
                    "Medium"
                ).length
              }
            </h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center">
            <h5 className="text-muted">
              Low Priority
            </h5>

            <h2 className="text-success">
              {
                tasks.filter(
                  (task) =>
                    task.priority === "Low"
                ).length
              }
            </h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3 text-center">
            <h5 className="text-muted">
              Overdue
            </h5>

            <h2 className="text-danger">
              {
                tasks.filter(
                  (task) =>
                    task.dueDate &&
                    new Date(
                      task.dueDate
                    ) < new Date() &&
                    task.status !==
                    "Completed"
                ).length
              }
            </h2>
          </div>
        </div>
      </div>

      <div className="card shadow-sm p-4 mb-4">
        <h4 className="mb-3">
          Team Productivity
        </h4>

        <div className="progress mb-3">
          <div
            className="progress-bar bg-success"
            style={{
              width: `${tasks.length > 0
                  ? (
                    (completedTasks /
                      tasks.length) *
                    100
                  ).toFixed(0)
                  : 0
                }%`,
            }}
          >
            {tasks.length > 0
              ? (
                (completedTasks /
                  tasks.length) *
                100
              ).toFixed(0)
              : 0}
            %
          </div>
        </div>

        <p>
          Completion Rate:
          {" "}
          {tasks.length > 0
            ? (
              (completedTasks /
                tasks.length) *
              100
            ).toFixed(0)
            : 0}
          %
        </p>
      </div>

      {user?.role === "Admin" && (
      <form
        onSubmit={createTask}
        className="card p-4 shadow mb-4"
      >
        <h3 className="mb-3">
          Create New Task
        </h3>

        <input
          type="text"
          placeholder="Task Title"
          className="form-control mb-3"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          placeholder="Task Description"
          className="form-control mb-3"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

          <label className="form-label fw-bold">Due Date</label>
        <input
          type="date"
          className="form-control mb-3"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
        />

          <label className="form-label fw-bold">
            Assign To
          </label>

          <select
            className="form-select mb-3"
            value={assignedTo}
            onChange={(e) =>
              setAssignedTo(e.target.value)
            }
          >
            <option value="">
              Select Team Member
            </option>

            {users.map((user) => (
              <option
                key={user._id}
                value={user._id}
              >
                {user.name} ({user.role})
              </option>
            ))}
          </select>

        <label className="form-label fw-bold">Task Priority</label>
        <select
          className="form-select mb-3"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button
          type="submit"
          className="btn btn-primary"
        >
          Create Task
        </button>
      </form>
      )}

      <div className="row">
        {tasks.map((task) => {
          const isOverdue =
            task.dueDate &&
            new Date(task.dueDate) <
              new Date() &&
            task.status !== "Completed";

          return (
            <div
              className="col-md-6"
              key={task._id}
            >
              <div
                className={`card shadow-sm mb-4 p-3 ${isOverdue
                    ? "border border-danger border-3"
                    : ""
                  }`}
                style={{
                  borderRadius: "15px",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="text-primary">
                    {task.title}
                  </h3>

                  <span
                    className={`badge ${task.priority === "High"
                        ? "bg-danger"
                        : task.priority ===
                          "Medium"
                          ? "bg-warning text-dark"
                          : "bg-success"
                      }`}
                  >
                    {task.priority}
                  </span>
                </div>

                <hr />

                <p>
                  <strong>Description:</strong>{" "}
                  {task.description}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge ${task.status === "Completed"
                        ? "bg-success"
                        : "bg-secondary"
                      }`}
                  >
                    {task.status}
                  </span>
                </p>

                <p>
                  <strong>Assigned To:</strong>{" "}
                  {task.assignedTo
                    ? task.assignedTo.name
                    : "Unassigned"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {task.assignedTo?.email ||
                    "N/A"}
                </p>

                <p>
                  <strong>Due Date:</strong>{" "}
                  {task.dueDate
                    ? new Date(
                      task.dueDate
                    ).toLocaleDateString()
                    : "No Due Date"}
                </p>

                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(
                    task.createdAt
                  ).toLocaleDateString()}
                </p>

                {isOverdue && (
                  <div className="alert alert-danger p-2">
                    Overdue Task
                  </div>
                )}

                <div className="mt-3">
                  <button
                    onClick={() =>
                      updateTaskStatus(
                        task._id,
                        "Completed"
                      )
                    }
                    className="btn btn-success"
                  >
                    Complete
                  </button>

                  {user?.role === "Admin" && (
                    <button
                      onClick={() =>
                        deleteTask(task._id)
                      }
                      className="btn btn-danger ms-2"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;