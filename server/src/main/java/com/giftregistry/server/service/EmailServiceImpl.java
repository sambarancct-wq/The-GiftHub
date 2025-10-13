package com.giftregistry.server.service;

import com.giftregistry.server.model.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username:default@example.com}")
    private String fromEmail;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy ");

    @Async
    @Override
    public void sendEventCreationEmail(String toEmail, Event event) {
        System.out.println("🚀 STARTING sendEventCreationEmail");
        System.out.println("📧 To: " + toEmail);
        System.out.println("📧 From: " + fromEmail);
        System.out.println("📧 Event: " + event.getName());
        
        try {
            // Check if mailSender is available
            if (mailSender == null) {
                System.err.println("❌ mailSender is NULL!");
                return;
            }
            
            System.out.println("📧 Creating MimeMessage...");
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("🎉 Your Event Has Been Created: " + event.getName());

            // Prepare the template context
            Context context = new Context();
            context.setVariable("event", event);
            context.setVariable("eventDate", event.getDate().format(DATE_FORMATTER));
            context.setVariable("eventKey", event.getEventKey());
            context.setVariable("creatorName", event.getCreator().getUsername());
            context.setVariable("dashboardUrl", baseUrl + "/dashboard/" + event.getId());

            System.out.println("📧 Processing email template...");
            // Process the HTML template
            String htmlContent = templateEngine.process("event-creation-email", context);
            System.out.println("📧 Template processed successfully");

            helper.setText(htmlContent, true);

            System.out.println("📧 Attempting to send email...");
            mailSender.send(message);
            System.out.println("✅ Event creation email sent successfully to: " + toEmail);

        } catch (MessagingException e) {
            System.err.println("❌ MessagingException - Failed to send event creation email to: " + toEmail);
            System.err.println("Error details: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("❌ General Exception - Failed to send event creation email to: " + toEmail);
            System.err.println("Error details: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Async
    @Override
    public void sendRSVPInvitation(String toEmail, Event event, Long rsvpId) {
        System.out.println("🚀 STARTING sendRSVPInvitation");
        System.out.println("📧 To: " + toEmail);
        System.out.println("📧 From: " + fromEmail);
        System.out.println("📧 Event: " + event.getName());
        System.out.println("📧 RSVP ID: " + rsvpId);
        
        try {
            // Check if mailSender is available
            if (mailSender == null) {
                System.err.println("❌ mailSender is NULL!");
                return;
            }
            
            System.out.println("📧 Creating MimeMessage...");
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("🎊 You're Invited: " + event.getName());

            // Prepare the template context
            Context context = new Context();
            context.setVariable("event", event);
            context.setVariable("eventDate", event.getDate().format(DATE_FORMATTER));
            context.setVariable("eventKey", event.getEventKey());
            context.setVariable("creatorName", event.getCreator().getUsername());
            context.setVariable("acceptUrl", baseUrl + "/rsvp/" + rsvpId + "/respond/accepted");
            context.setVariable("declineUrl", baseUrl + "/rsvp/" + rsvpId + "/respond/declined");
            context.setVariable("eventSearchUrl", baseUrl + "/search-event");

            System.out.println("📧 Processing email template...");
            // Process the HTML template
            String htmlContent = templateEngine.process("rsvp-invitation-email", context);
            System.out.println("📧 Template processed successfully");

            helper.setText(htmlContent, true);

            System.out.println("📧 Attempting to send email...");
            mailSender.send(message);
            System.out.println("✅ RSVP invitation sent successfully to: " + toEmail);

        } catch (MessagingException e) {
            System.err.println("❌ MessagingException - Failed to send RSVP invitation to: " + toEmail);
            System.err.println("Error details: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("❌ General Exception - Failed to send RSVP invitation to: " + toEmail);
            System.err.println("Error details: " + e.getMessage());
            e.printStackTrace();
        }
    }
}