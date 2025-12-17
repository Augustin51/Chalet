import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, arrivalDate, departureDate, guests, message } = await request.json();

    // Validation des champs obligatoires
    if (!name || !email || !phone || !arrivalDate || !departureDate || !guests) {
      return NextResponse.json(
        { success: false, error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Configuration du transporteur nodemailer avec Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Contenu de l'email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `Nouvelle demande de réservation - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c4b3a;">Nouvelle demande de réservation</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c4b3a; margin-top: 0;">Informations du client</h3>
            <p><strong>Nom complet :</strong> ${name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Téléphone :</strong> ${phone}</p>
          </div>

          <div style="background-color: #e9f3ef; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2c4b3a; margin-top: 0;">Détails du séjour</h3>
            <p><strong>Date d'arrivée :</strong> ${arrivalDate}</p>
            <p><strong>Date de départ :</strong> ${departureDate}</p>
            <p><strong>Nombre de personnes :</strong> ${guests}</p>
          </div>

          ${message ? `
            <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2c4b3a; margin-top: 0;">Message</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
          ` : ''}

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Cet email a été envoyé depuis le formulaire de contact du site Le Chalet.
          </p>
        </div>
      `,
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'Votre demande a été envoyée avec succès. Le propriétaire vous contactera dans les prochains jours' 
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    );
  }
}
