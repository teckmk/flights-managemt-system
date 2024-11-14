import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/auth';
import { connectDB } from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

export async function GET() {
	try {
		const session = await getServerSession();
		if (!session?.id) {
			return NextResponse.json(
				{ message: 'Unauthorized' },
				{ status: 401 }
			);
		}

		await connectDB();
		const user = await User.findById(session.id).select('-password');

		if (!user) {
			return NextResponse.json(
				{ message: 'User not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(user);
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message || 'Internal server error' },
			{ status: 500 }
		);
	}
}
