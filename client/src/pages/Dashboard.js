import { useEffect, useState } from "react";

import API from "../services/api";

function Dashboard() {
  const storedUser =
    localStorage.getItem("user");

  let user = null;

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.log(error);

    localStorage.removeItem(
      "user"
    );
  }

  const [tasks, setTasks] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState("Medium");

  const [dueDate, setDueDate] =
    useState("");

  const [assignedTo, setAssignedTo] =
    useState("");

  const fetchTasks = async () => {
    try {
      const res = await API.get(
        "/tasks"
      );

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

      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();

    fetchUsers();
  }, []);

  const createTask = async (e) => {
    e.preventDefault();

    try {
      await API.post("/tasks", {
        title,
        description,
        priority,
        dueDate,
        assignedTo,
      });

      alert("Task Created");

      setTitle("");

      setDescription("");

      setPriority("Medium");

      setDueDate("");

      setAssignedTo("");

      fetchTasks();
    } catch (error) {
      console.log(error);

      alert("Task Creation Failed");
    }
  };

  const updateTaskStatus =
    async (id, status) => {
      try {
        await API.put(
          `/tasks/${id}`,
          {
            status,
          }
        );

        fetchTasks();
      } catch (error) {
        console.log(error);
      }
    };

  const deleteTask = async (id) => {
    try {
      await API.delete(
        `/tasks/${id}`
      );

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.clear();

    window.location.href = "/";
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">
          Team Task Dashboard
        </h2>

        <div className="d-flex align-items-center">
          <div className="me-3 text-end">
            <h6 className="mb-0">
              {user?.name}
            </h6>

            <small className="text-muted">
              {user?.email}
            </small>
          </div>

          <button
            className="btn btn-dark"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="card p-4 shadow mb-4">
        <h4 className="mb-3">
          Create Task
        </h4>

        <form onSubmit={createTask}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Task Title"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            required
          />

          <textarea
            className="form-control mb-3"
            placeholder="Task Description"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            required
          />

          <select
            className="form-select mb-3"
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value
              )
            }
          >
            <option>
              Low
            </option>

            <option>
              Medium
            </option>

            <option>
              High
            </option>
          </select>

          <input
            type="date"
            className="form-control mb-3"
            value={dueDate}
            onChange={(e) =>
              setDueDate(
                e.target.value
              )
            }
          />

          <select
            className="form-select mb-3"
            value={assignedTo}
            onChange={(e) =>
              setAssignedTo(
                e.target.value
              )
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
                {user.name} (
                {user.role})
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Create Task
          </button>
        </form>
      </div>

      <div className="row">
        {tasks.map((task) => (
          <div
            className="col-md-4 mb-4"
            key={task._id}
          >
            <div className="card shadow p-3 h-100">
              <h5 className="text-primary">
                {task.title}
              </h5>

              <p>
                {task.description}
              </p>

              <p>
                <strong>
                  Priority:
                </strong>{" "}
                {task.priority}
              </p>

              <p>
                <strong>
                  Status:
                </strong>{" "}
                {task.status}
              </p>

              <p>
                <strong>
                  Due Date:
                </strong>{" "}
                {task.dueDate
                  ?.split("T")[0]}
              </p>

              <p>
                <strong>
                  Assigned To:
                </strong>{" "}
                {task.assignedTo
                  ?.name ||
                  "Unassigned"}
              </p>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() =>
                    updateTaskStatus(
                      task._id,
                      "Completed"
                    )
                  }
                >
                  Complete
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    deleteTask(
                      task._id
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;