import React, { useState } from "react";
import {
  GraduationCap,
  Book,
  ChevronDown,
  Layers,
  Calendar,
  GitBranch,
  Users,
  Clock,
  Trash2,
  Plus,
  Save,
} from "lucide-react";

export function TimetableUpload() {
  const [formData, setFormData] = useState({
    course: "",
    year: "",
    batch: "",
    stream: "",
    section: "",
    schedule: [
      { id: Date.now(), from: "", to: "", subject: "", instructor: "" },
    ],
  });

  const handleMainChange = (e) => {
    const { name, value } = e.target;
    if (name === "course") {
      setFormData((prev) => ({ ...prev, course: value, year: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleScheduleChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      ),
    }));
  };

  const addRow = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [
        ...prev.schedule,
        { id: Date.now(), from: "", to: "", subject: "", instructor: "" },
      ],
    }));
  };

  const removeRow = (id) => {
    setFormData((prev) => {
      if (prev.schedule.length > 1) {
        return {
          ...prev,
          schedule: prev.schedule.filter((row) => row.id !== id),
        };
      } else {
        return {
          ...prev,
          schedule: [
            { id: Date.now(), from: "", to: "", subject: "", instructor: "" },
          ],
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const yearsCount =
    formData.course === "B.Tech" ? 4 : formData.course === "M.Tech" ? 2 : 0;
  const yearOptions = Array.from({ length: yearsCount }, (_, i) => i + 1);

  return (
    <div className="bg-gray-50 flex flex-col h-dvh overflow-hidden font-body text-gray-800">
      <header className="bg-[#100636] shadow-md h-16 flex items-center px-4 sm:px-8 shrink-0 z-40">
        <div className="flex items-center w-full max-w-5xl">
          <h1 className="font-heading font-bold text-lg text-white tracking-wide">
            Timetable Upload
          </h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative bg-gray-50 overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-5xl mx-auto w-full pb-24">
          <div className="mb-6 md:mb-8">
            <h2 className="text-3xl font-heading font-bold tracking-tight text-gray-900">
              Upload Timetable
            </h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base font-medium">
              Define schedule details for a specific class batch. Add subjects,
              timings, and instructors below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-[#e7e5fc] rounded-full blur-2xl opacity-50 z-0 pointer-events-none"></div>

              <h3 className="text-lg font-bold font-heading text-[#100636] mb-6 relative z-10 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Academic Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700">
                    Course
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Book className="w-4 h-4 text-gray-400 group-focus-within:text-[#100636] transition-colors" />
                    </div>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleMainChange}
                      className="w-full h-11 pl-10.5 pr-10 text-sm font-medium bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] transition-all appearance-none outline-none text-gray-700 cursor-pointer hover:bg-white shadow-sm"
                      required
                    >
                      <option value="" disabled>
                        Select Course
                      </option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700">
                    Year
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Layers className="w-4 h-4 text-gray-400 group-focus-within:text-[#100636] transition-colors" />
                    </div>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleMainChange}
                      className="w-full h-11 pl-10.5 pr-10 text-sm font-medium bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] transition-all appearance-none outline-none text-gray-700 cursor-pointer hover:bg-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      required
                      disabled={!formData.course}
                    >
                      <option value="" disabled>
                        {!formData.course
                          ? "Select Course First"
                          : "Select Year"}
                      </option>
                      {yearOptions.map((i) => (
                        <option key={i} value={i}>
                          {i +
                            (i === 1
                              ? "st"
                              : i === 2
                                ? "nd"
                                : i === 3
                                  ? "rd"
                                  : "th")}{" "}
                          Year
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700">
                    Batch
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Calendar className="w-4 h-4 text-gray-400 group-focus-within:text-[#100636] transition-colors" />
                    </div>
                    <select
                      name="batch"
                      value={formData.batch}
                      onChange={handleMainChange}
                      className="w-full h-11 pl-10.5 pr-10 text-sm font-medium bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] transition-all appearance-none outline-none text-gray-700 cursor-pointer hover:bg-white shadow-sm"
                      required
                    >
                      <option value="" disabled>
                        Select Batch
                      </option>
                      <option value="2021">2021</option>
                      <option value="2022">2022</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700">
                    Stream
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <GitBranch className="w-4 h-4 text-gray-400 group-focus-within:text-[#100636] transition-colors" />
                    </div>
                    <select
                      name="stream"
                      value={formData.stream}
                      onChange={handleMainChange}
                      className="w-full h-11 pl-10.5 pr-10 text-sm font-medium bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] transition-all appearance-none outline-none text-gray-700 cursor-pointer hover:bg-white shadow-sm"
                      required
                    >
                      <option value="" disabled>
                        Select Stream
                      </option>
                      <option value="CSE">CSE</option>
                      <option value="EEE">EEE</option>
                      <option value="ECE">ECE</option>
                      <option value="MECH">MECH</option>
                      <option value="CIVIL">CIVIL</option>
                      <option value="IT">IT</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700">
                    Section
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Users className="w-4 h-4 text-gray-400 group-focus-within:text-[#100636] transition-colors" />
                    </div>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleMainChange}
                      className="w-full h-11 pl-10.5 pr-10 text-sm font-medium bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] transition-all appearance-none outline-none text-gray-700 cursor-pointer hover:bg-white shadow-sm"
                      required
                    >
                      <option value="" disabled>
                        Select Section
                      </option>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold font-heading text-[#100636] flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Timetable Details
                </h3>
              </div>

              <div className="space-y-4">
                {formData.schedule.map((row) => (
                  <div
                    key={row.id}
                    className="schedule-row relative grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-[#f8f9fc] p-5 rounded-2xl border border-gray-100 group transition-all animate-fade-in"
                  >
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="block text-[13px] font-bold text-gray-700">
                        From
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={row.from}
                          onChange={(e) =>
                            handleScheduleChange(row.id, "from", e.target.value)
                          }
                          className="w-full h-11 px-3 text-sm font-medium bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none shadow-sm text-gray-700"
                          required
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="block text-[13px] font-bold text-gray-700">
                        To
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={row.to}
                          onChange={(e) =>
                            handleScheduleChange(row.id, "to", e.target.value)
                          }
                          className="w-full h-11 px-3 text-sm font-medium bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none shadow-sm text-gray-700"
                          required
                        />
                      </div>
                    </div>

                    <div className="md:col-span-4 space-y-1.5">
                      <label className="block text-[13px] font-bold text-gray-700">
                        Subject Name
                      </label>
                      <div className="relative">
                        <select
                          value={row.subject}
                          onChange={(e) =>
                            handleScheduleChange(
                              row.id,
                              "subject",
                              e.target.value,
                            )
                          }
                          className="w-full h-11 px-4 pr-10 text-sm font-medium bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] appearance-none outline-none shadow-sm text-gray-700 cursor-pointer"
                          required
                        >
                          <option value="" disabled>
                            Select Subject
                          </option>
                          <option value="Data Networking">
                            Data Networking
                          </option>
                          <option value="Data Science">Data Science</option>
                          <option value="Algorithms">Algorithms</option>
                          <option value="Web Technologies">
                            Web Technologies
                          </option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-3 space-y-1.5">
                      <label className="block text-[13px] font-bold text-gray-700">
                        Taught By
                      </label>
                      <div className="relative">
                        <select
                          value={row.instructor}
                          onChange={(e) =>
                            handleScheduleChange(
                              row.id,
                              "instructor",
                              e.target.value,
                            )
                          }
                          className="w-full h-11 px-4 pr-10 text-sm font-medium bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] appearance-none outline-none shadow-sm text-gray-700 cursor-pointer"
                          required
                        >
                          <option value="" disabled>
                            Select Instructor
                          </option>
                          <option value="Dr. John Doe">Dr. John Doe</option>
                          <option value="Prof. Alan Smith">
                            Prof. Alan Smith
                          </option>
                          <option value="Dr. Ada Wong">Dr. Ada Wong</option>
                          <option value="Prof. Jane Roe">Prof. Jane Roe</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-1 flex justify-end md:justify-center">
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100 focus:outline-none"
                        title="Remove row"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={addRow}
                  className="w-full py-3.5 border-2 border-dashed border-gray-200 hover:border-[#100636]/40 bg-gray-50/50 hover:bg-[#e7e5fc]/20 text-gray-600 hover:text-[#100636] font-bold rounded-2xl flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  Add Another Class
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-white bg-[#100636] rounded-xl hover:bg-[#1a0b54] focus:outline-none focus:ring-4 focus:ring-[#100636]/20 transition-all shadow-[0_4px_14px_rgba(16,6,54,0.39)] hover:shadow-[0_6px_20px_rgba(16,6,54,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                <Save className="w-4 h-4" />
                Submit Timetable
              </button>
            </div>
          </form>
        </div>
      </main>
      <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
    </div>
  );
}
