'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, PlaneTakeoff } from 'lucide-react';

const loginSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

export const layout = null; // Skip layout for this page

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			const response = await fetch('/api/auth/session');
			if (response.ok) {
				const session = await response.json();
				router.push('/dashboard');
			}
		};
		checkAuth();
	}, [router]);

	const form = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	async function onSubmit(data: LoginValues) {
		setIsLoading(true);
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'CSRF-Token': await getCsrfToken(),
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || 'Login failed');
			}

			// Redirect to the original destination or dashboard
			const from = searchParams.get('from') || '/dashboard';
			router.push(from);
			router.refresh();
		} catch (error: any) {
			toast({
				title: 'Error',
				description:
					error.message || 'Failed to login. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	}

	async function getCsrfToken() {
		const response = await fetch('/api/auth/csrf');
		const { csrfToken } = await response.json();
		return csrfToken;
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
			<div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
				<div className="text-center">
					<div className="flex justify-center">
						<PlaneTakeoff className="h-12 w-12 text-primary" />
					</div>
					<h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
						Welcome back
					</h2>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Please sign in to your account
					</p>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="you@example.com"
											{...field}
										/>
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
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="w-full"
							disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Signing in...
								</>
							) : (
								'Sign in'
							)}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
