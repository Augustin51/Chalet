"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useAdmin } from "@/components/common/AdminProvider";
import { useContentEditor } from "@/utils/useContentEditor";
import EditableImage from "@/components/admin/EditableImage";

interface Activity {
  id: number;
  title: string;
  description: string;
}
interface Nearby {
  id: number;
  time: string;
  label: string;
  color: string;
}

interface ActivitiesSectionProps {
  imageSrc: string;
  imageAlt: string;
  activitiesList: Activity[];
  nearbyList: Nearby[];
  season: "winter" | "summer";
  page?: string;
}

export default function ActivitiesSection({ imageSrc, imageAlt, activitiesList, nearbyList, season, page = "autour" }: ActivitiesSectionProps) {
  const isAdmin = useAdmin();
  const { handleUpdate } = useContentEditor(page, "ActivitiesSection");

  const autoResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    e.currentTarget.style.height = 'auto';
    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
  };

  useEffect(() => {
    if (isAdmin) {
      const textareas = document.querySelectorAll('textarea');
      textareas.forEach((textarea) => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      });
    }
  }, [isAdmin, activitiesList]);

  async function updateActivity(id: number, field: string, value: string) {
    try {
      await fetch('/api/activity/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, field, value }),
      });
    } catch (err) {
      console.error('Failed to update activity', err);
    }
  }

  async function updateNearby(id: number, field: string, value: string) {
    try {
      await fetch('/api/nearby/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, field, value }),
      });
    } catch (err) {
      console.error('Failed to update nearby', err);
    }
  }

  function handleInlineKey(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, saveFn: () => void) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveFn();
      (e.target as HTMLElement).blur();
    }
  }

  return (
    <section className="bg-[#fdfaf5] py-12 px-6 rounded-xl">
      <div className="max-w-6xl mx-auto">
        <div className="relative w-full h-72 md:h-96 mb-8 overflow-hidden rounded-2xl shadow-sm">
          <EditableImage
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            onUpdate={async (newImageName) => {
              await fetch('/api/content/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  page: page,
                  component: 'ActivitiesSection',
                  key: `${season}_image_src`,
                  value: newImageName
                })
              });
              window.location.reload();
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {activitiesList.map((activity) => (
            <div
              key={activity.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-left"
            >
              {isAdmin ? (
                <>
                  <input
                    type="text"
                    defaultValue={activity.title}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => updateActivity(activity.id, 'title', e.target.value)}
                    onKeyDown={(e) => handleInlineKey(e, () => updateActivity(activity.id, 'title', (e.target as HTMLInputElement).value))}
                    className="text-xl font-semibold text-emerald-900 mb-2 w-full p-1 rounded bg-white/20"
                  />
                  <textarea
                    defaultValue={activity.description}
                    onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => updateActivity(activity.id, 'description', e.target.value)}
                    onKeyDown={(e) => handleInlineKey(e, () => updateActivity(activity.id, 'description', (e.target as HTMLTextAreaElement).value))}
                    onInput={autoResize}
                    className="text-emerald-700/80 text-sm w-full p-1 rounded bg-transparent border-transparent focus:border-emerald-700/30 focus:bg-white/5 transition-colors resize-none overflow-hidden min-h-[3rem]"
                  />
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-emerald-900 mb-2">
                    {activity.title}
                  </h3>
                  <p className="text-emerald-700/80 text-sm">
                    {activity.description}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 flex justify-around text-center shadow-sm">
          {nearbyList.map((item) => (
            <div key={item.id}>
              {isAdmin ? (
                <>
                  <input
                    type="text"
                    defaultValue={item.time}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => updateNearby(item.id, 'time', e.target.value)}
                    onKeyDown={(e) => handleInlineKey(e, () => updateNearby(item.id, 'time', (e.target as HTMLInputElement).value))}
                    className={`text-2xl font-bold ${item.color} mb-1 w-full p-1 rounded bg-white/20 text-center`}
                  />
                  <input
                    type="text"
                    defaultValue={item.label}
                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => updateNearby(item.id, 'label', e.target.value)}
                    onKeyDown={(e) => handleInlineKey(e, () => updateNearby(item.id, 'label', (e.target as HTMLInputElement).value))}
                    className="text-sm text-gray-600 w-full p-1 rounded bg-white/20 text-center"
                  />
                </>
              ) : (
                <>
                  <p className={`text-2xl font-bold ${item.color} mb-1`}>{item.time}</p>
                  <p className="text-sm text-gray-600">{item.label}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}