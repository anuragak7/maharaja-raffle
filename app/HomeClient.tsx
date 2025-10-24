"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entrySchema, type EntryInput } from "@/lib/validation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import ToastRoot, { toastError, toastSuccess } from "@/components/Toast";

export default function HomeClient() {
  const [loading, setLoading] = useState(false);
  const [csrf, setCsrf] = useState<string>("");
  const [showGoodLuck, setShowGoodLuck] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EntryInput>({
    resolver: zodResolver(entrySchema),
  });

  useEffect(() => {
    document.getElementById("firstName")?.focus();
    // Fetch CSRF token from API route
    fetch("/api/csrf")
      .then((res) => res.json())
      .then((data) => setCsrf(data.token || ""));
  }, []);

  const onSubmit = async (data: EntryInput) => {
    try {
      setLoading(true);
      const res = await fetch("/api/raffle/enter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrf,
        },
        body: JSON.stringify(data),
      });

      // Debug: log status and content-type
      const contentType = res.headers.get('content-type') || '';
      console.log('Response status:', res.status, 'content-type:', contentType);

      let json: any = null;
      if (contentType.includes('application/json')) {
        json = await res.json();
      } else {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        toastError('Server error: Non-JSON response');
        return;
      }

      if (!res.ok) {
        toastError(json?.message || "Something went wrong");
        return;
      }

      toastSuccess("You're in! Good luck 🍀");
      reset();
      setShowGoodLuck(true);
      setTimeout(() => setShowGoodLuck(false), 2500);
    } catch (e: any) {
      toastError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh flex flex-col relative">
      <ToastRoot />
      {showGoodLuck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-fuchsia-200 via-sky-100 to-emerald-200 bg-opacity-95 animate-fade-in-out">
          <span className="text-7xl font-extrabold text-emerald-600 drop-shadow-lg animate-pulse">GOOD LUCK 🍀</span>
        </div>
      )}
      <header className="p-6 text-center">
        <h1 className="text-2xl font-bold">Maharaja Farmers Market — Raffle Registration</h1>
        <p className="text-gray-600">Enter for a chance to win!</p>
      </header>
      <section className="flex-1 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-4" aria-describedby="privacy-note">
          <Input label="First Name" id="firstName" {...register("firstName", { required: true })} error={errors.firstName?.message} />
          <Input label="Last Name" {...register("lastName", { required: true })} error={errors.lastName?.message} />
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
            <select
              id="location"
              {...register("location", { required: true })}
              className="w-full rounded-xl border px-3 py-2 bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200 placeholder-gray-400"
              defaultValue=""
              required
            >
              <option value="" disabled>Select location</option>
              <option value="Hicksville">Hicksville</option>
              <option value="Bellerose">Bellerose</option>
            </select>
            {errors.location && (
              <div className="text-red-600 text-xs mt-1">{errors.location.message}</div>
            )}
          </div>
          <Input
            label="Phone Number"
            placeholder="(555) 123-4567"
            inputMode="tel"
            {...register("phone", { required: true })}
            error={errors.phone?.message}
          />
          <div className="flex items-center gap-2 mt-2">
            <input
              id="marketingOptIn"
              type="checkbox"
              className="accent-pink-400 w-4 h-4 rounded focus:ring-pink-400 focus:ring-2 transition-all duration-200"
              {...register("marketingOptIn")}
            />
            <label htmlFor="marketingOptIn" className="text-sm select-none">I agree to be contacted about promotions.</label>
          </div>
          <Button type="submit" disabled={loading} aria-busy={loading} aria-live="polite">
            {loading ? "Submitting…" : "Submit"}
          </Button>
        </form>
      </section>
      <footer className="p-6 text-center text-xs text-gray-600" id="privacy-note">
        We use your information only for the raffle and optional promotions.
      </footer>
    </main>
  );
}