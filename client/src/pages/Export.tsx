import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { api } from '../utils/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Download, Share2, Check, Loader2, Home } from 'lucide-react';

export function Export() {
  const navigate = useNavigate();
  const { scores, answers, profileId, shareUrl, setProfile } = useStore();
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scores) {
      navigate('/questionnaire');
      return;
    }

    // Auto-save profile if not already saved
    if (!profileId) {
      saveProfile();
    }
  }, [scores, profileId]);

  const saveProfile = async () => {
    if (!scores) return;

    setIsSaving(true);
    setError(null);

    try {
      const answersArray = Object.entries(answers).map(([questionId, choiceId]) => ({
        questionId,
        choiceId,
      }));

      const result = await api.saveProfile(scores, answersArray);
      setProfile(result.profileId, result.shareUrl);
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadJSON = () => {
    if (!scores) return;

    const profileData = {
      profileId,
      scores,
      answers: Object.entries(answers).map(([questionId, choiceId]) => ({
        questionId,
        choiceId,
      })),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(profileData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `context-profile-${profileId || 'draft'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  if (!scores) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-bold">Save & Share Your Profile</h1>
          <p className="text-muted-foreground">
            Your cognitive fingerprint has been saved
          </p>
        </motion.div>

        {/* Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
              <CardDescription>
                {profileId ? `Profile ID: ${profileId}` : 'Saving your profile...'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-muted">
                  <div className="font-semibold">Questions Answered</div>
                  <div className="text-2xl font-bold text-primary">
                    {Object.keys(answers).length}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="font-semibold">Traits Analyzed</div>
                  <div className="text-2xl font-bold text-primary">10</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Export Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Share Link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Shareable Link
              </CardTitle>
              <CardDescription>
                Share your cognitive profile with others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isSaving ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating link...</span>
                </div>
              ) : shareUrl ? (
                <>
                  <div className="p-3 rounded-lg bg-muted text-sm font-mono break-all">
                    {shareUrl}
                  </div>
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className="w-full"
                    data-testid="copy-link-btn"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 mr-2" />
                        Copy Link
                      </>
                    )}
                  </Button>
                </>
              ) : error ? (
                <div className="text-red-600 text-sm">{error}</div>
              ) : null}
            </CardContent>
          </Card>

          {/* Download JSON */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download JSON
              </CardTitle>
              <CardDescription>
                Export your profile data for your records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleDownloadJSON}
                variant="outline"
                className="w-full"
                disabled={isSaving}
                data-testid="download-json-btn"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Profile JSON
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center pt-4"
        >
          <Button
            variant="ghost"
            onClick={() => {
              useStore.getState().reset();
              navigate('/');
            }}
            data-testid="start-over-btn"
          >
            <Home className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
