"use client";

import { useState, useRef } from "react";

import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { string, object } from "valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import Loading from "@/components/Loading";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

const formSchema = object({
  username: string("This is required field."),
  password: string("This is required field."),
});

const providers = authOptions.providers;

export default function LoginCard() {
  const form = useForm({
    mode: "onBlur",
    resolver: valibotResolver(formSchema),
  });

  const [loading, setLoading] = useState(false);

  const CardRef = useRef(null);

  const handleSignIn = (provider) => async (e) => {
    try {
      setLoading(true);

      provider === "credentials"
        ? await signIn(provider, {
            username: e.username,
            password: e.password,
          })
        : await signIn(provider);

      form.reset();
    } catch (err) {
      console.log(err);
    }
  };

  const LoadingMask = () => (
    <div className="flex justify-center items-center rounded-xl absolute">
      <Loading className="absolute z-50" />
      <div
        style={{
          width: `${CardRef.current?.getBoundingClientRect().width}px`,
          height: `${CardRef.current?.getBoundingClientRect().height}px`,
        }}
        className={`bg-background opacity-70 z-40`}></div>
    </div>
  );

  return providers ? (
    <Card ref={CardRef} className="w-96">
      {loading && <LoadingMask />}
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Log In</CardTitle>
        <CardDescription>Enter your email below to log in or create your account</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-4">
          {Object.values(providers)
            .filter((singleProvider) => singleProvider.id !== "credentials")
            .map((singleProvider) => (
              <Button
                key={singleProvider.id}
                variant="outline"
                onClick={handleSignIn(singleProvider.id)}>
                {<Icons provider={singleProvider.id} className="mr-2 h-4 w-4" />}
                {singleProvider.name}
              </Button>
            ))}
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
      </CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignIn("credentials"))}>
          <CardContent>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground'>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-foreground'>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button className="w-full">Log In</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  ) : (
    <Loading />
  );
}
