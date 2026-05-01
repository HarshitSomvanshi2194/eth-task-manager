import React, { useEffect, useState } from "react";

const API = "http://localhost:5000";

export default function TaskManagerApp() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([
    { id: "260209", name: "omni-elo-without", status: "Active", owner: "AK", progress: "75%" },
    { id: "251210", name: "conversations-to-response-h2h-without", status: "Active", owner: "AK", progress: "60%" },
    { id: "260317", name: "omni-t2v-elo-with-just", status: "Paused", owner: "AK", progress: "40%" },
  ]);
  const [form, setForm] = useState({ title: "", time: 0, projectId: "260209" });
  const [projectForm, setProjectForm] = useState({ id: "", name: "" });
  const [session, setSession] = useState({ start: null, end: null });
  const [elapsedTime, setElapsedTime] = useState(0);
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState({ email: "", password: "", name: "" });
  const [isLogin, setIsLogin] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");

  const loginSignup = async () => {
    const url = isLogin ? "/login" : "/signup";
    const res = await fetch(API + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(auth),
    });
    const data = await res.json();

    if (isLogin) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser({ email: auth.email }); // simple
    } else {
      alert("Signup done");
      setIsLogin(true);
    }
  };

  const fetchTasks = async () => {
    const res = await fetch(API + "/tasks", {
      headers: { Authorization: token },
    });
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  useEffect(() => {
    let interval;
    if (session.start && !session.end) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((new Date() - session.start) / 1000));
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [session]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setTasks([]);
    setSession({ start: null, end: null });
  };

  const addTask = async () => {
    if (!form.title.trim()) return alert("Please enter a task title");
    if (!form.time) return alert("Please enter task hours");

    const selectedProject = projects.find((p) => p.id === form.projectId);
    const taskPayload = {
      title: form.title,
      time: form.time,
      projectId: form.projectId,
      projectName: selectedProject?.name || "",
    };

    await fetch(API + "/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(taskPayload),
    });

    setForm({ title: "", time: 0, projectId: projects[0]?.id || "" });
    fetchTasks();
  };

  const addProject = () => {
    if (!projectForm.id.trim() || !projectForm.name.trim()) return alert("Please enter both project ID and name");
    if (projects.some((project) => project.id === projectForm.id)) return alert("Project ID already exists");

    setProjects([
      ...projects,
      {
        id: projectForm.id,
        name: projectForm.name,
        status: "Active",
        owner: user?.email || "Me",
        progress: "0%",
      },
    ]);
    setProjectForm({ id: "", name: "" });
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#0f1419',
      minHeight: '100vh',
      color: '#ffffff',
      display: 'flex',
    },
    sidebar: {
      width: '240px',
      backgroundColor: '#1a1f2e',
      padding: '20px',
      borderRight: '1px solid #2d3748',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      height: '100vh',
      overflowY: 'auto',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '30px',
      fontSize: '18px',
      fontWeight: 'bold',
    },
    logoIcon: {
      backgroundColor: '#00bcd4',
      color: '#1a1f2e',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
    },
    navList: {
      listStyle: 'none',
      padding: 0,
      margin: '0 0 auto 0',
    },
    navItem: {
      padding: '12px 15px',
      marginBottom: '8px',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: '#a0aec0',
      transition: 'all 0.3s',
    },
    navItemActive: {
      backgroundColor: '#00bcd4',
      color: '#1a1f2e',
    },
    mainContent: {
      marginLeft: '240px',
      flex: 1,
      padding: '20px',
      overflowY: 'auto',
    },
    authContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
      color: 'white',
    },
    authBox: {
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '40px',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    input: {
      display: 'block',
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #555',
      borderRadius: '5px',
      fontSize: '16px',
      backgroundColor: '#333',
      color: '#fff',
    },
    button: {
      backgroundColor: '#00bcd4',
      color: '#1a1f2e',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      margin: '10px 5px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      paddingBottom: '20px',
      borderBottom: '1px solid #2d3748',
    },
    headerTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    content: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginBottom: '30px',
    },
    card: {
      backgroundColor: '#1a1f2e',
      border: '1px solid #2d3748',
      borderRadius: '8px',
      padding: '20px',
    },
    section: {
      backgroundColor: '#1a1f2e',
      border: '1px solid #2d3748',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
    },
    warning: {
      backgroundColor: '#7f1d1d',
      border: '1px solid #dc2626',
      color: '#fca5a5',
      padding: '12px',
      borderRadius: '6px',
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    taskForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      fontSize: '14px',
      marginBottom: '5px',
      color: '#a0aec0',
    },
    tableContainer: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '12px',
      textAlign: 'left',
      borderBottom: '1px solid #2d3748',
      color: '#7f8fa3',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #2d3748',
      fontSize: '14px',
    },
    projectGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
    },
    projectCard: {
      backgroundColor: '#1a1f2e',
      border: '1px solid #2d3748',
      borderRadius: '8px',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
  };

  if (!token) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authBox}>
          <h2>{isLogin ? "Login" : "Signup"}</h2>
          {!isLogin && (
            <input
              placeholder="Name"
              style={styles.input}
              onChange={(e) => setAuth({ ...auth, name: e.target.value })}
            />
          )}
          <input
            placeholder="Email"
            style={styles.input}
            onChange={(e) => setAuth({ ...auth, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            onChange={(e) => setAuth({ ...auth, password: e.target.value })}
          />
          <button style={styles.button} onClick={loginSignup}>
            {isLogin ? "Login" : "Signup"}
          </button>
          <p style={{ cursor: 'pointer', color: '#bbb' }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Signup" : "Already have an account? Login"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>TT</div>
          <span>Task Track</span>
        </div>

        <ul style={styles.navList}>
          <li
            style={{
              ...styles.navItem,
              ...(activeNav === "dashboard" ? styles.navItemActive : {}),
            }}
            onClick={() => setActiveNav("dashboard")}
          >
            
          </li>
          <li
            style={{
              ...styles.navItem,
              ...(activeNav === "tasks" ? styles.navItemActive : {}),
            }}
            onClick={() => setActiveNav("tasks")}
          >
            ✓ My Tasks
          </li>
          <li
            style={{
              ...styles.navItem,
              ...(activeNav === "projects" ? styles.navItemActive : {}),
            }}
            onClick={() => setActiveNav("projects")}
          >
          
          </li>
          <li style={styles.navItem}>📅 Attendance</li>
        </ul>

        <button
          style={{ ...styles.button, width: '100%' }}
          onClick={logout}
        >
          Sign Out
        </button>
      </div>

    
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>
            {activeNav === "dashboard" && "Dashboard"}
            {activeNav === "tasks" && "My Tasks"}
            {activeNav === "projects" && "My Projects"}
          </h1>
          <div style={styles.userInfo}>
            <span>Welcome, {user?.email}</span>
          </div>
        </div>

        {activeNav === "dashboard" && (
          <>
            {/* Time Tracking Section - Full Width */}
            <div style={styles.section}>
              <h2 style={{ marginTop: 0 }}>⏱️ Time Tracking</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Timer Display */}
                <div style={{ 
                  background: 'linear-gradient(135deg, #1f5f3f 0%, #0d3d1f 100%)',
                  border: '2px solid #10b981',
                  borderRadius: '8px',
                  padding: '30px',
                  textAlign: 'center'
                }}>
                  {session.start && !session.end ? (
                    <>
                      <div style={{ color: '#7f8fa3', fontSize: '14px', marginBottom: '10px' }}>TIME ELAPSED</div>
                      <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981', fontFamily: 'monospace', letterSpacing: '2px' }}>
                        {formatTime(elapsedTime)}
                      </div>
                      <div style={{ color: '#10b981', fontSize: '12px', marginTop: '10px' }}>● CLOCKED IN</div>
                    </>
                  ) : (
                    <>
                      <div style={{ color: '#7f8fa3', fontSize: '14px', marginBottom: '10px' }}>READY TO START</div>
                      <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#a0aec0', fontFamily: 'monospace' }}>
                        00:00:00
                      </div>
                      <div style={{ color: '#7f8fa3', fontSize: '12px', marginTop: '10px' }}>● CLOCKED OUT</div>
                    </>
                  )}
                </div>

                {/* Control & Stats */}
                <div>
                  <div style={{ marginBottom: '15px' }}>
                    {session.start && !session.end ? (
                      <button
                        style={{ ...styles.button, width: '100%', padding: '15px', backgroundColor: '#dc2626' }}
                        onClick={() => setSession({ ...session, end: new Date() })}
                      >
                        🛑 PUNCH OUT
                      </button>
                    ) : (
                      <button
                        style={{ ...styles.button, width: '100%', padding: '15px' }}
                        onClick={() => setSession({ start: new Date(), end: null })}
                      >
                        ▶️ PUNCH IN
                      </button>
                    )}
                  </div>

                  {session.end && (
                    <div style={{ padding: '15px', backgroundColor: '#1f5f3f', border: '1px solid #10b981', borderRadius: '6px' }}>
                      <div style={{ color: '#7f8fa3', fontSize: '12px', marginBottom: '8px' }}>LAST SESSION DURATION</div>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981', fontFamily: 'monospace' }}>
                        {formatTime(Math.floor((session.end - session.start) / 1000))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={styles.content}>
              {/* Left Column - Add Task */}
              <div>
                <div style={styles.section}>
                  <h2 style={{ marginTop: 0 }}>➕ Add New Task</h2>

                  {!session.start && (
                    <div style={styles.warning}>
                      <span>⚠️</span>
                      <span>You must punch in before adding tasks</span>
                    </div>
                  )}

                  {session.start && !session.end && (
                    <div style={{ ...styles.warning, backgroundColor: '#1f5f3f', borderColor: '#10b981' }}>
                      <span>✓</span>
                      <span>You are clocked in - Ready to log tasks</span>
                    </div>
                  )}

                  <div style={styles.taskForm}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Task Title *</label>
                      <input
                        placeholder="Enter task title"
                        value={form.title}
                        style={styles.input}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Project</label>
                      <select
                        value={form.projectId}
                        style={styles.input}
                        onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                      >
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.id} - {project.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Hours Spent</label>
                      <input
                        type="number"
                        placeholder="Hours spent"
                        value={form.time}
                        style={styles.input}
                        onChange={(e) => setForm({ ...form, time: e.target.value })}
                      />
                    </div>

                    <button
                      style={styles.button}
                      onClick={() => {
                        if (!session.start) alert("Please punch in first");
                        else addTask();
                      }}
                    >
                      ➕ Add Task
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Stats */}
              <div>
                <div style={styles.section}>
                  <h2 style={{ marginTop: 0 }}>📊 Today's Stats</h2>
                  <div style={{ padding: '15px 0' }}>
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ color: '#7f8fa3', fontSize: '12px', marginBottom: '5px' }}>TOTAL TASKS</div>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#00bcd4' }}>{tasks.length}</div>
                    </div>
                    <div>
                      <div style={{ color: '#7f8fa3', fontSize: '12px', marginBottom: '5px' }}>TOTAL HOURS</div>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
                        {tasks.reduce((sum, t) => sum + parseFloat(t.time || 0), 0).toFixed(1)}h
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div style={styles.section}>
              <h2 style={{ marginTop: 0 }}>📋 Today's Tasks</h2>
              {tasks.length === 0 ? (
                <p style={{ color: '#7f8fa3' }}>No tasks logged yet</p>
              ) : (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Task</th>
                        <th style={styles.th}>Project</th>
                        <th style={styles.th}>Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((t, idx) => (
                        <tr key={t.id || idx}>
                          <td style={styles.td}>{t.title}</td>
                          <td style={styles.td}>{t.projectName || '-'}</td>
                          <td style={styles.td}>{t.time}h</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activeNav === "tasks" && (
          <div style={styles.section}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ marginTop: 0 }}>All Tasks</h2>
              <p style={{ color: '#7f8fa3', margin: '5px 0 0 0' }}>{tasks.length} tasks logged</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <input
                  placeholder="🔍 Search..."
                  style={{
                    ...styles.input,
                    padding: '10px 15px',
                    margin: 0,
                  }}
                />
              </div>
              <select style={{ ...styles.input, margin: 0, minWidth: '150px' }}>
                <option>All Status</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
              <input
                type="date"
                style={{ ...styles.input, margin: 0, minWidth: '120px' }}
              />
              <span style={{ color: '#7f8fa3' }}>to</span>
              <input
                type="date"
                style={{ ...styles.input, margin: 0, minWidth: '120px' }}
              />
              <button style={{ ...styles.button, padding: '10px 15px', margin: 0 }}>7d</button>
              <button style={{ ...styles.button, padding: '10px 15px', margin: 0 }}>14d</button>
              <button style={{ ...styles.button, padding: '10px 15px', margin: 0 }}>30d</button>
            </div>

            {tasks.length === 0 ? (
              <p style={{ color: '#7f8fa3', textAlign: 'center', padding: '20px' }}>No tasks yet</p>
            ) : (
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Task ID</th>
                      <th style={styles.th}>Title</th>
                      <th style={styles.th}>Project</th>
                      <th style={styles.th}>Hours</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t, idx) => (
                      <tr key={t.id || idx}>
                        <td style={styles.td}>{t.title}</td>
                        <td style={styles.td}>{t.title}</td>
                        <td style={styles.td}>{t.projectName || '-'}</td>
                        <td style={styles.td}>{t.time}h</td>
                        <td style={styles.td}>
                          <span style={{ color: '#10b981', fontWeight: '600' }}>COMPLETED</span>
                        </td>
                        <td style={styles.td}>
                          <span style={{ cursor: 'pointer', color: '#00bcd4' }}>👁️</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeNav === "projects" && (
          <div style={styles.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ marginTop: 0 }}>My Projects</h2>
                <p style={{ color: '#7f8fa3', margin: '5px 0 0 0' }}>{projects.length} projects</p>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '20px', marginBottom: '20px' }}>
              <div style={styles.section}>
                <h3 style={{ marginTop: 0 }}>Create New Project</h3>
                <div style={styles.taskForm}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Project ID</label>
                    <input
                      placeholder="Enter project ID"
                      value={projectForm.id}
                      style={styles.input}
                      onChange={(e) => setProjectForm({ ...projectForm, id: e.target.value })}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Project Name</label>
                    <input
                      placeholder="Enter project name"
                      value={projectForm.name}
                      style={styles.input}
                      onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    />
                  </div>
                  <button style={styles.button} onClick={addProject}>
                    + Add Project
                  </button>
                </div>
              </div>
            </div>

            <div style={styles.projectGrid}>
              {projects.map((project) => (
                <div key={project.id} style={styles.projectCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <div>
                      <div style={{ fontSize: '14px', color: '#7f8fa3' }}>Project ID</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{project.id}</div>
                    </div>
                    <div style={{ color: project.status === 'Active' ? '#10b981' : '#fbbf24', fontWeight: 'bold' }}>{project.status}</div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '14px', color: '#7f8fa3' }}>Name</div>
                    <div style={{ fontSize: '16px' }}>{project.name}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#7f8fa3' }}>Owner</div>
                      <div>{project.owner}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#7f8fa3' }}>Progress</div>
                      <div>{project.progress}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
