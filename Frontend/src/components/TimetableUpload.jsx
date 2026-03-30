import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Book,
  ChevronDown,
  Clock,
  Layers,
  Calendar,
  GitBranch,
  Users,
  Trash2,
  Plus,
  Save,
} from "lucide-react";
import { createTimetable } from "../services/timetable.services";
import { getCollegeDetails } from "../services/verification.services";

export function TimetableUpload() {
  const [formData, setFormData] = useState({
    dept: "",
    section: "",
    batchFrom: "",
    batchTo: "",
    semNumber: "",
    dateFrom: "",
    dateTo: "",
    instructions: "",
    timeslots: [
      {
        id: Date.now(),
        day: "",
        from_time: "",
        to_time: "",
        class_type: "",
        description: "",
        room_no: "",
        block: "",
      },
    ],
  });
  const [collegeId, setCollegeId] = useState("");
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCollege = async () => {
      const response = await getCollegeDetails();
      if (response.status) {
        setCollegeId(response.college._id);
      } else {
        setMessage("Unable to load college details. Please refresh the page.");
      }
    };
    loadCollege();
  }, []);

  const handleMainChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeslotChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      timeslots: prev.timeslots.map((slot) =>
        slot.id === id ? { ...slot, [field]: value } : slot,
      ),
    }));
  };

  const addRow = () => {
    setFormData((prev) => ({
      ...prev,
      timeslots: [
        ...prev.timeslots,
        {
          id: Date.now(),
          day: "",
          from_time: "",
          to_time: "",
          class_type: "",
          description: "",
          room_no: "",
          block: "",
        },
      ],
    }));
  };

  const removeRow = (id) => {
    setFormData((prev) => ({
      ...prev,
      timeslots: prev.timeslots.filter((slot) => slot.id !== id),
    }));
  };

  const buildDayByDay = () => {
    return formData.timeslots.reduce((acc, slot) => {
      if (!slot.day) return acc;
      const dayKey = slot.day;
      const timeItem = {
        from_time: slot.from_time,
        to_time: slot.to_time,
        class_type: slot.class_type,
        description: slot.description,
        room_no: slot.room_no ? Number(slot.room_no) : undefined,
        block: slot.block,
      };

      const existing = acc.find((item) => item.day === dayKey);
      if (existing) {
        existing.times.push(timeItem);
      } else {
        acc.push({
          day: dayKey,
          instructions: formData.instructions,
          times: [timeItem],
        });
      }
      return acc;
    }, []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!collegeId) {
      setMessage("College information is missing.");
      return;
    }

    if (
      !formData.dept ||
      !formData.section ||
      !formData.batchFrom ||
      !formData.batchTo ||
      !formData.semNumber ||
      !formData.dateFrom ||
      !formData.dateTo
    ) {
      setMessage("Please complete all timetable metadata fields.");
      return;
    }

    const dayByDay = buildDayByDay();
    if (!dayByDay.length) {
      setMessage("Please add at least one timetable slot with a day selected.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Authentication token not found. Please log in again.");
      return;
    }

    const payload = {
      from: formData.dateFrom ? new Date(formData.dateFrom) : undefined,
      to: formData.dateTo ? new Date(formData.dateTo) : undefined,
      dept: formData.dept,
      section: formData.section,
      batch: {
        from: Number(formData.batchFrom),
        to: Number(formData.batchTo),
      },
      sem_number: Number(formData.semNumber),
      college: collegeId,
      day_by_day: dayByDay,
    };

    setIsSubmitting(true);
    const response = await createTimetable(collegeId, token, payload);
    setIsSubmitting(false);

    if (response.status) {
      setMessage("Timetable created successfully.");
      setFormData({
        dept: "",
        section: "",
        batchFrom: "",
        batchTo: "",
        semNumber: "",
        dateFrom: "",
        dateTo: "",
        instructions: "",
        timeslots: [
          {
            id: Date.now(),
            day: "",
            from_time: "",
            to_time: "",
            class_type: "",
            description: "",
            room_no: "",
            block: "",
          },
        ],
      });
    } else {
      setMessage(
        `Failed to create timetable: ${response.error?.message || response.error || "Unknown error"}`,
      );
    }
  };


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
                    Department
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Book className="w-4 h-4 text-gray-400 group-focus-within:text-[#100636] transition-colors" />
                    </div>
                    <select
                      id="dept"
                      name="dept"
                      value={formData.dept}
                      onChange={handleMainChange}
                      className="w-full h-11 pl-10.5 pr-10 text-sm font-medium bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] transition-all appearance-none outline-none text-gray-700 cursor-pointer hover:bg-white shadow-sm"
                      required
                    >
                      <option value="" disabled>
                        Select Course
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
                    Semester Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Layers className="w-4 h-4 text-gray-400 group-focus-within:text-[#100636] transition-colors" />
                    </div>
                    <select
                      id="semNumber"
                      name="semNumber"
                      value={formData.semNumber}
                      onChange={handleMainChange}
                      className="w-full h-11 pl-10.5 pr-10 text-sm font-medium bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] transition-all appearance-none outline-none text-gray-700 cursor-pointer hover:bg-white shadow-sm"
                      required
                    >
                      <option value="" disabled>
                      Select Semester
                      </option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700">
                    Batch From
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Calendar className="w-4 h-4 text-gray-400 group-focus-within:text-[#100636] transition-colors" />
                    </div>
                    <select
                      id="batchFrom"
                      name="batchFrom"
                      value={formData.batchFrom}
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
                    Batch To
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <GitBranch className="w-4 h-4 text-gray-400 group-focus-within:text-[#100636] transition-colors" />
                    </div>
                    <select
                      id="batchTo"
                      name="batchTo"
                      value={formData.batchTo}
                      onChange={handleMainChange}
                      className="w-full h-11 pl-10.5 pr-10 text-sm font-medium bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] transition-all appearance-none outline-none text-gray-700 cursor-pointer hover:bg-white shadow-sm"
                      required
                    >
                      <option value="" disabled>
                        Select Batch To
                      </option>
                      <option value="2022">2022</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <label htmlFor="dateFrom" className="block text-sm font-bold text-gray-700">Schedule From</label>
                  <input
                    id="dateFrom"
                    name="dateFrom"
                    type="date"
                    value={formData.dateFrom}
                    onChange={handleMainChange}
                    className="w-full h-12 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none text-gray-700"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="dateTo" className="block text-sm font-bold text-gray-700">Schedule To</label>
                  <input
                    id="dateTo"
                    name="dateTo"
                    type="date"
                    value={formData.dateTo}
                    onChange={handleMainChange}
                    className="w-full h-12 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none text-gray-700"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label htmlFor="instructions" className="block text-sm font-bold text-gray-700">Instructions</label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleMainChange}
                    rows="3"
                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none text-gray-700"
                    placeholder="Optional schedule notes"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold font-heading text-[#100636] flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Timetable Slots
                </h3>
              </div>

              <div className="space-y-4">
                {formData.timeslots.map((row) => (
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
                          value={row.from_time}
                          onChange={(e) =>
                            handleTimeslotChange(row.id, "from_time", e.target.value)
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
                          value={row.to_time}
                          onChange={(e) =>
                            handleTimeslotChange(row.id, "to_time", e.target.value)
                          }
                          className="w-full h-11 px-3 text-sm font-medium bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] outline-none shadow-sm text-gray-700"
                          required
                        />
                      </div>
                    </div>

                    <div className="md:col-span-4 space-y-1.5">
                      <label className="block text-[13px] font-bold text-gray-700">
                        Day
                      </label>
                      <div className="relative">
                        <select
                          value={row.day}
                          onChange={(e) =>
                            handleTimeslotChange(
                              row.id,
                              "day",
                              e.target.value,
                            )
                          }
                          className="w-full h-11 px-4 pr-10 text-sm font-medium bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] appearance-none outline-none shadow-sm text-gray-700 cursor-pointer"
                          required
                        >
                          <option value="" disabled>
                            Select Day
                          </option>
                          <option value="monday">Monday</option>
                          <option value="tuesday">Tuesday</option>
                          <option value="wednesday">Wednesday</option>
                          <option value="thursday">Thursday</option>
                          <option value="friday">Friday</option>
                          <option value="saturday">Saturday</option>
                          <option value="sunday">Sunday</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-3 space-y-1.5">
                      <label className="block text-[13px] font-bold text-gray-700">
                        Class Type
                      </label>
                      <div className="relative">
                        <select
                          value={row.class_type}
                          onChange={(e) =>
                            handleTimeslotChange(
                              row.id,
                              "class_type",
                              e.target.value,
                            )
                          }
                          className="w-full h-11 px-4 pr-10 text-sm font-medium bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100636]/20 focus:border-[#100636] appearance-none outline-none shadow-sm text-gray-700 cursor-pointer"
                          required
                        >
                          <option value="" disabled>
                            Select Class Type
                          </option>
                          <option value="theory">Theory</option>
                          <option value="lab">Lab</option>
                          <option value="tutorial">Tutorial</option>
                          <option value="break">Break</option>
                          <option value="sports">Sports</option>
                          <option value="mentor">Mentor</option>
                          <option value="online">Online</option>
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

            {message && (
              <div className="rounded-2xl bg-[#f8fafc] border border-[#d1e8ff] px-4 py-3 text-sm text-[#0f4c81]">
                {message}
              </div>
            )}

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
