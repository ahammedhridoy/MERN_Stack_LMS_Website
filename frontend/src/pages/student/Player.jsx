import React from "react";

const Player = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Video Player</h1>
      <video className="w-full" controls>
        <source src="video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Player;
