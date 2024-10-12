import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function ProfileEdit() {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [researchAreas, setResearchAreas] = useState('');
  const [topic, setTopic] = useState('');
  const [location, setLocation] = useState('AB1');
  const [date, setDate] = useState(new Date());
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [scholar, setScholar] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDesignationChange = (e) => {
    setDesignation(e.target.value);
  };

  const handleResearchAreasChange = (e) => {
    setResearchAreas(e.target.value);
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleWebsiteChange = (e) => {
    setWebsite(e.target.value);
  };

  const handleTwitterChange = (e) => {
    setTwitter(e.target.value);
  };

  const handleLinkedinChange = (e) => {
    setLinkedin(e.target.value);
  };

  const handleScholarChange = (e) => {
    setScholar(e.target.value);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center">
            <img
                className="h-16 w-16 rounded-full mr-4"
                src="/profile-picture.jpg"
                alt="Profile picture"
            />
            <button className="bg-gray-200 hover:bg-gray-300 rounded-lg px-4 py-2">
                Upload profile picture
            </button>
        </div>
        <form className="mt-8">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
                </label>
                <div className="mt-1">
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={handleNameChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                </div>
            </div>
            <div className="mt-4">
                <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                Designation
                </label>
                <div className="mt-1">
                <input
                    type="text"
                    name="designation"
                    id="designation"
                    value={designation}
                    onChange={handleDesignationChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                </div>
            </div>
            <div className="mt-4">
                <label htmlFor="research-areas" className="block text-sm font-medium text-gray-700">
                    Research Areas
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        name="research-areas"
                        id="research-areas"
                        value={researchAreas}
                        onChange={handleResearchAreasChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
            </div>
            <div className="mt-4">
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                    Topic of speech
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        name="topic"
                        id="topic"
                        value={topic}
                        onChange={handleTopicChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
            </div>
            <div className="mt-4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location of speech
                </label>
                <div className="mt-1">
                    <select
                        name="location"
                        id="location"
                        value={location}
                        onChange={handleLocationChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                        <option value="AB1">AB1</option>
                        <option value="AB2">AB2</option>
                        <option value="AB3">AB3</option>
                    </select>
                </div>
            </div>
            <div className="mt-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                </label>
                <div className="mt-1">
                    <DatePicker
                        selected={date}
                        onChange={handleDateChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
            </div>
            <div className="mt-4">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Personal website
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        name="website"
                        id="website"
                        value={website}
                        onChange={handleWebsiteChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Socials</label>
                <div className="mt-1">
                    <input
                        type="text"
                        name="twitter"
                        id="twitter"
                        value={twitter}
                        onChange={handleTwitterChange}
                        placeholder="Twitter"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
                <div className="mt-1">
                    <input
                        type="text"
                        name="linkedin"
                        id="linkedin"
                        value={linkedin}
                        onChange={handleLinkedinChange}
                        placeholder="LinkedIn"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
                <div className="mt-1">
                    <input
                        type="text"
                        name="scholar"
                        id="scholar"
                        value={scholar}
                        onChange={handleScholarChange}
                        placeholder="Google Scholar"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
            </div>
        </form>
</div>
);
}

export default ProfileEdit;
