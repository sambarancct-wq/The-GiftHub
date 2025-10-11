package com.giftregistry.server.service;

import com.giftregistry.server.model.Event;
import com.giftregistry.server.model.User;
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
import java.util.Locale;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy 'at' h:mm a");

    @Async
    @Override
    public void sendEventCreationEmail(String toEmail, Event event) {
        try {
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

            // Process the HTML template
            String htmlContent = templateEngine.process("event-creation-email", context);

            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("✅ Event creation email sent successfully to: " + toEmail);

        } catch (MessagingException e) {
            System.err.println("❌ Failed to send event creation email to: " + toEmail);
            e.printStackTrace();
        }
    }

    @Async
    @Override
    public void sendRSVPInvitation(String toEmail, Event event, Long rsvpId) {
        try {
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
            context.setVariable("acceptUrl", baseUrl + "/api/rsvp/" + rsvpId + "/respond?response=accepted");
            context.setVariable("declineUrl", baseUrl + "/api/rsvp/" + rsvpId + "/respond?response=declined");
            context.setVariable("eventSearchUrl", baseUrl + "/search-event");

            // Process the HTML template
            String htmlContent = templateEngine.process("rsvp-invitation-email", context);

            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("✅ RSVP invitation sent successfully to: " + toEmail);

        } catch (MessagingException e) {
            System.err.println("❌ Failed to send RSVP invitation to: " + toEmail);
            e.printStackTrace();
        }
    }
}