"use client";

import { useParams } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { ConnectionActions } from "@/components/domain/connection-actions";
import { MessageButton } from "@/components/domain/message-button";
import { MentorRequestButton } from "@/components/domain/mentor-request-button";
import { usePublicProfile } from "@/hooks/api/use-directory";
import { useAuth } from "@/components/providers/auth-provider";

export default function PublicProfilePage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const { profile, loading, error, refetch } = usePublicProfile(params.id);

  if (loading) return <LoadingState variant="rows" count={3} message="Loading profile..." />;
  if (error) return <ErrorState title="Profile unavailable" message={error} onRetry={() => refetch()} />;
  if (!profile) {
    return (
      <EmptyState
        title="Profile not found"
        description="This person may have been removed or the link is incorrect."
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="gradient-hero-panel p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {profile.role}
          </Badge>
          {profile.verificationStatus === "verified" && (
            <Badge variant="secondary">
              <GraduationCap className="size-3" />
              Verified
            </Badge>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-white">{profile.name}</h1>
        <p className="text-sm text-[#c2c2c2] max-w-2xl">
          {profile.headline || "This member has not added a headline yet."}
        </p>
        {user?.id !== profile.id && (
          <div className="flex flex-wrap gap-2">
            <ConnectionActions userId={profile.id} />
            <MessageButton userId={profile.id} />
            <MentorRequestButton mentorId={profile.id} openToMentor={profile.openToMentor} />
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["Programme", profile.programme],
          ["Department", profile.department],
          ["Faculty", profile.faculty],
          ["Graduation year", profile.graduationYear],
          ["Industry", profile.industry],
          ["Company", profile.company],
          ["Job title", profile.jobTitle],
          ["Location", profile.location],
        ].map(([label, value]) => (
          <div key={String(label)} className="frosted-glass-card p-4">
            <div className="text-xs text-[#686868]">{label}</div>
            <div className="text-sm text-[#ededed] mt-1">{value || "—"}</div>
          </div>
        ))}
      </section>

      {profile.about && (
        <section className="frosted-glass-card p-5 space-y-2">
          <h2 className="text-base font-medium">About</h2>
          <p className="text-sm text-[#c2c2c2] leading-relaxed">{profile.about}</p>
        </section>
      )}

      {profile.skills.length > 0 && (
        <section className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
        </section>
      )}
    </div>
  );
}
