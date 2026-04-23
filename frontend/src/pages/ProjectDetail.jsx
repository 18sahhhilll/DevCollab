import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import SkillTag from "../components/SkillTag";
import MatchBadge from "../components/MatchBadge";
import ApplicationModal from "../components/ApplicationModal";
import { calculateMatch } from "../utils/match";
import toast from "react-hot-toast";
import {
  Users,
  Calendar,
  MessageSquare,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useSocket } from "../context/SocketContext";
// import { Github } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const socket = useSocket();


  const load = useCallback(async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);

      if (data.createdBy._id === user._id) {
        const appRes = await api.get(`/applications/project/${id}`);
        setApplications(appRes.data);
      }
    } catch {
      toast.error("Project not found");
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  }, [id, user, navigate]);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data) => {
      if (data.projectId === id) {
        load();
      }
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket, id, load]); 

  const handleDelete = async () => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted");
      navigate("/projects");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleApplication = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}`, { status });
      toast.success(`Application ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  if (loading)
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "4rem" }}
      >
        <div className="spinner" />
      </div>
    );
  if (!project) return null;

  const isOwner =
    project.createdBy._id === user._id || project.createdBy === user._id;
  const isMember = project.members?.some((m) => (m._id || m) === user._id);
  const matchData = calculateMatch(
    user.skills || [],
    project.requiredSkills || [],
  );
  const teamFull = project.members?.length >= project.teamSize;
  const myApp = null; // could fetch individually

  const TABS = [
    "overview",
    ...(isOwner ? ["applications"] : []),
    ...(isMember || isOwner ? ["team"] : []),
  ];

  return (
    <div className="animate-fade" style={{ maxWidth: 860, margin: "0 auto" }}>
      {/* Back */}
      <button
        onClick={() => navigate("/projects")}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--text-muted)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          fontSize: "0.875rem",
        }}
      >
        <ArrowLeft size={16} /> Back to Projects
      </button>

      {/* Hero */}
      <div className="card" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              <span className={`status-${project.status}`}>
                {project.status}
              </span>
              {project.category && (
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--text-muted)",
                    background: "rgba(255,255,255,0.05)",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "9999px",
                  }}
                >
                  {project.category}
                </span>
              )}
              {matchData && <MatchBadge score={matchData.score} />}
            </div>
            <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
              {project.title}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.25rem",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Users size={13} /> {project.members?.length || 1}/
                {project.teamSize} members
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <Calendar size={13} />{" "}
                {format(new Date(project.createdAt), "MMM d, yyyy")}
              </span>
              {project.applicationCount > 0 && (
                <span>
                  {project.applicationCount} applicant
                  {project.applicationCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {isOwner && (
              <>
                <button
                  className="btn-secondary"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "0.5rem 1rem",
                    fontSize: "0.875rem",
                  }}
                  onClick={() => navigate(`/projects/${id}/edit`)}
                >
                  <Edit2 size={15} /> Edit
                </button>
                <button
                  className="btn-danger"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "0.5rem 1rem",
                    fontSize: "0.875rem",
                  }}
                  onClick={handleDelete}
                >
                  <Trash2 size={15} /> Delete
                </button>
              </>
            )}
            {(isMember || isOwner) && (
              <button
                className="btn-secondary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                }}
                onClick={() => navigate(`/chat/${id}`)}
              >
                <MessageSquare size={15} /> Team Chat
              </button>
            )}
            {!isOwner &&
              !isMember &&
              project.status === "open" &&
              !teamFull && (
                <button
                  className="btn-primary"
                  style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}
                  onClick={() => setShowApplyModal(true)}
                >
                  Apply to Join
                </button>
              )}
            {teamFull && !isOwner && !isMember && (
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  padding: "0.5rem",
                }}
              >
                Team is full
              </span>
            )}
          </div>
        </div>

        {/* Skills */}
        {project.requiredSkills?.length > 0 && (
          <div style={{ marginBottom: "1.25rem" }}>
            <div
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                marginBottom: "0.5rem",
                fontWeight: 500,
              }}
            >
              REQUIRED SKILLS
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {project.requiredSkills.map((s) => (
                <SkillTag
                  key={s}
                  skill={s}
                  matched={matchData?.matchedSkills
                    ?.map((x) => x.toLowerCase())
                    .includes(s.toLowerCase())}
                />
              ))}
            </div>
          </div>
        )}

        {/* GitHub
        {project.githubRepo && (
          <a href={project.githubRepo} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', border: '1px solid var(--border)', padding: '0.375rem 0.875rem', borderRadius: '0.5rem' }}
            onClick={e => e.stopPropagation()}>
            <Github size={15} /> View Repository <ExternalLink size={12} />
          </a>
        )} */}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.25rem",
          marginBottom: "1.25rem",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "0",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "0.625rem 1.25rem",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 600,
              borderBottom:
                activeTab === tab
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
              color:
                activeTab === tab ? "var(--accent-light)" : "var(--text-muted)",
              textTransform: "capitalize",
              transition: "all 0.2s",
            }}
          >
            {tab}{" "}
            {tab === "applications" && applications.length > 0 && (
              <span
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  borderRadius: "9999px",
                  padding: "0 6px",
                  fontSize: "0.72rem",
                  marginLeft: "4px",
                }}
              >
                {applications.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content: Overview */}
      {activeTab === "overview" && (
        <div className="card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.05rem", marginBottom: "1rem" }}>
            About this Project
          </h2>
          <p
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.7,
              color: "var(--text-secondary)",
              fontSize: "0.95rem",
            }}
          >
            {project.description}
          </p>
          {project.tags?.length > 0 && (
            <div style={{ marginTop: "1.5rem" }}>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                }}
              >
                TAGS
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {project.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--text-muted)",
                      background: "rgba(255,255,255,0.04)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "9999px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Creator */}
          <div
            style={{
              marginTop: "1.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {project.createdBy.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                  marginBottom: "2px",
                }}
              >
                Created by
              </div>
              <div
                style={{
                  fontWeight: 600,
                  cursor: "pointer",
                  color: "var(--accent-light)",
                }}
                onClick={() => navigate(`/users/${project.createdBy._id}`)}
              >
                {project.createdBy.name}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                {project.createdBy.role}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Applications (owner) */}
      {activeTab === "applications" && isOwner && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {applications.length === 0 ? (
            <div
              className="card"
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--text-muted)",
              }}
            >
              No applications yet
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app._id}
                className="card"
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", gap: "1rem", flex: 1 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {app.applicant?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        marginBottom: "2px",
                        cursor: "pointer",
                        color: "var(--accent-light)",
                      }}
                      onClick={() => navigate(`/users/${app.applicant._id}`)}
                    >
                      {app.applicant?.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text-muted)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {app.applicant?.role} • {app.applicant?.experienceLevel}
                    </div>
                    {app.applicant?.skills?.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.375rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {app.applicant.skills.slice(0, 4).map((s) => (
                          <SkillTag
                            key={s}
                            skill={s}
                            matched={project.requiredSkills
                              ?.map((x) => x.toLowerCase())
                              .includes(s.toLowerCase())}
                          />
                        ))}
                      </div>
                    )}
                    {app.message && (
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--text-secondary)",
                          fontStyle: "italic",
                        }}
                      >
                        "{app.message}"
                      </p>
                    )}
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                        marginTop: "0.25rem",
                      }}
                    >
                      {formatDistanceToNow(new Date(app.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
                {app.status === "pending" ? (
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="btn-primary"
                      style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}
                      onClick={() => handleApplication(app._id, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="btn-danger"
                      style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}
                      onClick={() => handleApplication(app._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: app.status === "accepted" ? "#10b981" : "#ef4444",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {app.status === "accepted" ? (
                      <CheckCircle size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}{" "}
                    {app.status}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab Content: Team */}
      {activeTab === "team" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {project.members?.map((member) => (
            <div
              key={member._id || member}
              className="card"
              style={{
                padding: "1.25rem",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/users/${member._id || member}`)}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "1.125rem",
                  margin: "0 auto 0.75rem",
                }}
              >
                {member.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                {member.name || "Member"}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  marginTop: "2px",
                }}
              >
                {member.role}
              </div>
              {(member._id || member) ===
                (project.createdBy._id || project.createdBy) && (
                <span
                  style={{
                    fontSize: "0.7rem",
                    background: "rgba(99,102,241,0.15)",
                    color: "var(--accent-light)",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "9999px",
                    marginTop: "0.375rem",
                    display: "inline-block",
                  }}
                >
                  Owner
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {showApplyModal && (
        <ApplicationModal
          project={project}
          onClose={() => setShowApplyModal(false)}
          onSuccess={load}
        />
      )}
    </div>
  );
}
