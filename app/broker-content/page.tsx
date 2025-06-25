"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Skeleton } from "../../components/ui/skeleton";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { AlertCircle, RefreshCw } from "lucide-react";
import { fetchBrokerContent } from "../../lib/supabase";

export default function BrokerContentPage() {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadContent = async () => {
    try {
      // Use the utility function from lib/supabase.ts
      const data = await fetchBrokerContent();
      setContent(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    setRefreshing(true);
    loadContent();
  };

  // Load content on initial render
  useEffect(() => {
    loadContent();
  }, []);

  const renderPageContent = () => {
    // Loading state
    if (loading && !refreshing) {
      return (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Broker Website Content</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      );
    }

    // Error state
    if (error) {
      return (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Broker Website Content</h1>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load broker content: {error}
            </AlertDescription>
          </Alert>
          <div className="p-6 border rounded-md bg-muted/50">
            <h2 className="text-xl font-semibold mb-4">Supabase Configuration Required</h2>
            <p className="mb-4">To use this page, you need to configure your Supabase credentials:</p>
            <ol className="list-decimal pl-6 space-y-2 mb-6">
              <li>Create a <code>.env.local</code> file in the project root</li>
              <li>Add your Supabase URL: <code>NEXT_PUBLIC_SUPABASE_URL=your_supabase_url</code></li>
              <li>Add your Supabase anon key: <code>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key</code></li>
              <li>Restart the development server</li>
            </ol>
            <p className="text-sm text-muted-foreground">
              Alternatively, you can edit the <code>lib/supabase.ts</code> file directly to add your credentials.
            </p>
          </div>
        </>
      );
    }

    // No content state
    if (content.length === 0) {
      return (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Broker Website Content</h1>
            <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
              {refreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-medium mb-2">No Content Found</h2>
                <p className="text-muted-foreground max-w-md mb-6">
                  No broker content found in your Supabase database. Make sure your n8n workflow has run successfully and saved data to the <code>broker_website_contents</code> table.
                </p>
                <div className="p-4 bg-muted rounded-md text-left w-full max-w-lg">
                  <p className="font-medium mb-2">Workflow Requirements:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Fetch broker website data from Supabase</li>
                    <li>Extract news/blog content from the websites</li>
                    <li>Save the content to the <code>broker_website_contents</code> table</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      );
    }

    // Content display with tabs for different views
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Broker Website Content</h1>
          <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
            {refreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>
        
        <div className="mb-6">
          <Badge variant="outline" className="mr-2">
            {content.length} Articles
          </Badge>
          <Badge variant="secondary" className="mr-2">
            Last updated: {new Date().toLocaleDateString()}
          </Badge>
        </div>
        
        <Tabs defaultValue="grid" className="mb-6">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.map((item) => (
                <Card key={item.id} className="overflow-hidden h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{item.title || "Untitled"}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      {item.name || "Unknown Source"} • {item.url ? new URL(item.url).hostname : "No URL"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="line-clamp-4 text-muted-foreground">
                      {item.content || "No content available"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="list">
            <div className="space-y-4">
              {content.map((item) => (
                <Card key={item.id}>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-1">{item.title || "Untitled"}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.name || "Unknown Source"} • {item.url ? new URL(item.url).hostname : "No URL"}
                      {item.created_at && ` • ${new Date(item.created_at).toLocaleDateString()}`}
                    </p>
                    <p className="line-clamp-3">{item.content || "No content available"}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  return (
    <div className="container mx-auto py-8">
      {renderPageContent()}
    </div>
  );
}
