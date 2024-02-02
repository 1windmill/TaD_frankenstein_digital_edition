<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xs tei"
    version="2.0">
    
    <!-- <xsl:output method="xml" omit-xml-declaration="yes" indent="yes" /> -->

    
    <xsl:template match="tei:TEI">
                     <div class="row">
                         <div class="col">
                             <h4>About the manuscript page:</h4>
                                <div>
                                    <xsl:value-of select="//tei:sourceDesc"/>
                                </div>
                             <div>
                                 <xsl:value-of select="//tei:licence"/> <!-- You can change the way the metadata is visualised as well-->
                             </div>
                         </div>
                         <div class="col">
                            <dl>
                                <dt>Total number of modifications: </dt>
                                <dd>
                                    <xsl:value-of select="count(//tei:del|//tei:add)" /> <!-- Counts all the add and del elements, and puts it in a list item -->
                                </dd>
                                <dt>Number of additions: </dt>
                                <dd>
                                   <xsl:value-of select="count(//tei:add)" /> <!-- count the additions only -->
                                </dd>
                                <dt>Number of deletions: </dt>
                                <dd>
                                    <xsl:value-of select="count(//tei:del)" />
                                </dd>
                                <!-- add other list items in which you count things, such as the modifications made by Percy -->
                                <dt>Modifications by Percy B. Shelley: </dt>
                                <dd>
                                    <xsl:value-of select="count(//tei:del[@hand='#PBS']|//tei:add[@hand='#PBS'])" />
                                </dd>
                                <dt>Modifications by Mary W. Shelley: </dt>
                                <dd>    
                                    <xsl:value-of select="count(//tei:del[@hand='#MWS']|//tei:add[@hand='#MWS'])" />
                                </dd>
                                <dt>Number of words in the present page: </dt>
                                <dd>
                                    <xsl:value-of select="count(//tei:p//child::text())" />
                                </dd>                                                                
                            </dl>
                        </div>
                     </div>
        <hr/>
    </xsl:template>
    

</xsl:stylesheet>
