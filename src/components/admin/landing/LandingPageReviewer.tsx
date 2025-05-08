import React, { useState, useEffect } from "react";
import { getLandingPageReview } from "src/utils/ai"; // Assuming a helper function for AI interaction

interface ReviewItem {
  id: number;
  text: string;
  checked: boolean;
}

interface LandingPageReviewerProps {
  content: string; // Pass the landing page content for AI assessment
}

const LandingPageReviewer: React.FC<LandingPageReviewerProps> = ({ content }) => {
  const [checklist, setChecklist] = useState<ReviewItem[]>([]);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewData = await getLandingPageReview(content);
        setChecklist(reviewData.checklist);
        setScore(reviewData.score);
      } catch (error) {
        console.error("Error fetching landing page review:", error);
        // Handle error appropriately (e.g., display an error message)
      }
    };

    fetchData();
  }, [content]);

  return (
    <div className="border rounded p-4">
      <h3 className="text-lg font-semibold mb-2">Internal Reviewer</h3>
      <p className="text-sm text-gray-500">AI Assessment of Landing Page Content</p>
      <div className="mt-4">
        <h4 className="text-md font-semibold">Checklist</h4>
        <ul className="list-none pl-0 mt-2">
          {checklist.map((item) => (
            <li key={item.id} className="flex items-center py-1">
              <input
                type="checkbox"
                id={`checklist-item-${item.id}`}
                className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={item.checked}
                readOnly
              />
              <label htmlFor={`checklist-item-${item.id}`} className="text-sm text-gray-700">
                {item.text}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h4 className="text-md font-semibold">Score</h4>
        <p className="text-2xl font-bold text-green-600">{score}<span className="text-sm text-gray-500">/100</span></p>
      </div>
    </div>
  );
};

export default LandingPageReviewer;