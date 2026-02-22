import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRoadmapById } from "../api/roadmapApi";
import RoadmapFlow from "../components/RoadmapFlow";

export default function RoadmapPage() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const data = await getRoadmapById(id);
      setRoadmap(data.roadmap);
    } catch (err) {
      console.error("Error loading roadmap:", err);
    }
  };

  if (!roadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-400">
        Loading roadmap...
      </div>
    );
  }

  return (
    <div className="pt-24 px-6">
      <RoadmapFlow roadmap={roadmap} />
    </div>
  );
}